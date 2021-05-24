/** 
* Jsonwebtoken helper
* @author Manoj Jain
 * @since 1.0
 * @version 1.0
*/

'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const configFile = 'modules/config/config.json';
var fs = require('fs');
var configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));

const secret = crypto.randomBytes(16).toString('base64');

module.exports.createJWT = function(userDetail){
    return jwt.sign({account:userDetail}, secret, { expiresIn: configData.jwtTokenExpiry });
};

module.exports.verifyJWT = function(token){
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return false;
    }
};


