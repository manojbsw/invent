/**
 * Common error handling.
 *
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

'use strict';


//Imports

var logger = require('../utils/Logger');
var ErrorCodes = require('./ErrorCodes');
var StockTickerError = require('./StockTickerError');

exports.handleErrorResponse = function (res, error) {
    var statusCode;    
    var response;
    var message = (error.message instanceof Object) ? error.message : error.message.replace(/['"]/g, '');
    if (error instanceof StockTickerError) {
        logger.debug(" Error message sent in response: " + message);
        statusCode = error.statusCode;
        response = { errormessage: message, errorcode: error.errorCode }

    } else {
        logger.debug(" Error message sent in response: " + message);
        statusCode = 500;
        response = { errormessage: message, errorcode: ErrorCodes.INTERNAL_SERVER_ERROR.errorCode }
    }
    res.status(statusCode).send(response);
}
