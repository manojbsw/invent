/** 
* Service to start Http server with provided configuration
* @author Manoj Jain
 * @since 1.0
 * @version 1.0
*/

'use strict';
var http = require('http');
var https = require('https');
var fs = require('fs');
var Constants = require('../commons/Constants');
var logger = require('./Logger');
var server;
var configData;
var isProduction = false;
function HttpHelper(config){
    configData = config;
    isProduction = (process.env.DEPLOYMENT_MODE === 'production' || configData.DEPLOYMENT_MODE === 'production') ? true : false;
}

HttpHelper.prototype.createServer = function(app){
    
    if(isProduction){
        var certKey = fs.readFileSync(configData.certificateKeyFile, 'utf8');
        var cert = fs.readFileSync(configData.certificateFile, 'utf8');

        var options = {
            key: certKey,
            cert: cert,
            secureProtocol: 'TLSv1_2_method'
        };
        createStartServer(options, app);
    } else{
        createStartServer({}, app);
    }
    
};

module.exports = HttpHelper;

function createStartServer(options, app) {
    var tempServer;
    var port = configData.port;
    if(isProduction) {
        tempServer =  https.createServer(options, app)
    } else {
        tempServer = http.createServer(app)
        port = process.env.HTTP_PORT || 80  
    }
    server = tempServer.listen(port, (err) => {
        if (err) {
            logger.error("Stock Ticker Service failed to start" + err);
        }
        else {
            logger.info("Stock Ticker Service started");
        }
    });
    server.setTimeout(900*1000); //Default timeout set to 900 seconds
}
