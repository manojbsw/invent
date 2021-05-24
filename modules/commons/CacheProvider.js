/**
 * User cache manager which holds the user name and hashed password
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */
const constants = require('./Constants');
var ErrorCodes = require('../commons/ErrorCodes');
var StockTickerError = require('../commons/StockTickerError');

const userCache = new Map();


module.exports = {

  addUser:(userId, passwdHash) => new Promise((resolve, reject) => {

      if(userCache.has(userId)) {
        reject(new StockTickerError(ErrorCodes.USER_ALREADY_EXIST.message, ErrorCodes.USER_ALREADY_EXIST));
      } else if(userCache.size === constants.MAX_USER_ALLOWED) {
        reject(new StockTickerError(ErrorCodes.MAX_SUPPORTED_USER_LIMIT_REACHED.message, ErrorCodes.MAX_SUPPORTED_USER_LIMIT_REACHED));
      } else {
        userCache.set(userId, passwdHash);
        resolve();
      }
      
  }),

  getUser:(userId) => new Promise((resolve, reject) => {
  
      if (!userCache.has(userId)) {
        reject(new StockTickerError(ErrorCodes.USER_NOT_FOUND.message, ErrorCodes.USER_NOT_FOUND));
      } else {
        resolve(userCache.get(userId))
      }
  })
}
