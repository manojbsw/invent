/**
 * 
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

'use strict';
var jWTHelper = require('../utils/JWTHelper');

module.exports.validateToken = function(req, res, next) {

    if (req.headers['authorization']) {

        let authHeader = req.headers['authorization'].split(' ');
        if (authHeader[0] !== 'Bearer') {
            return res.status(401).send();
        } else {
            if(jWTHelper.verifyJWT(authHeader[1])) {
                return next();
            }else {
                return res.status(403).send();
            }
        }
    } else {
        return res.status(401).send();
    }
};