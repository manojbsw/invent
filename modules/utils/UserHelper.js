/**
 * User management
 *
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

'use strict';
const crypto = require('crypto');
const cacheProvider = require('../commons/CacheProvider');
var ErrorCodes = require('../commons/ErrorCodes');
var StockTickerError = require('../commons/StockTickerError');

module.exports = {

    createUser:(userId, passwd) => new Promise((resolve, reject) => {

        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512',salt).update(passwd).digest("base64");
        var hashedPass = salt + "$" + hash;
        cacheProvider.addUser(userId, hashedPass).then(() => {
            resolve();
        },(rej) => {
            reject(rej);
        });
    }),
  
    validateUser:(userId, passwd) => new Promise((resolve, reject) => {
  
        cacheProvider.getUser(userId).then((passwdHash) => {
            let passwdArr = passwdHash.split('$');
            let salt = passwdArr[0];
            let hash = crypto.createHmac('sha512', salt).update(passwd).digest("base64");
            if(hash === passwdArr[1]) {
                resolve();
            } else {
                reject(new StockTickerError(ErrorCodes.INVALID_CREDS.message, ErrorCodes.INVALID_CREDS));
            }
        },(rej) => {
            reject(rej);
        });
    })
  }