/**
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */
const ErrorCodes = require('./ErrorCodes');


function StockTickerError(message, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    if(errorCode){
        this.errorCode = errorCode.errorCode;
        this.statusCode = errorCode.statusCode;
    }else{
        this.errorCode = ErrorCodes.INTERNAL_SERVER_ERROR.errorCode;
        this.statusCode = ErrorCodes.INTERNAL_SERVER_ERROR.statusCode;
    }
    if (message) {
        this.message = message;
    } 
    else {
        this.message = errorCode.message;
    } 
    this.name = this.constructor.name;
}

require('util').inherits(StockTickerError, Error);

module.exports = StockTickerError;
