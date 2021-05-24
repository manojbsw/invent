/**
 * Common error messages with their http error code, error description and sticker service error code
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

"use strict"; // NOSONAR

module.exports = Object.freeze({

    //common Error codes
    "INTERNAL_SERVER_ERROR": { statusCode: 500, errorCode: "InternalServerError", message: "Internal server error occurred." },
    
    "STOCK_DETAIL_NOT_FOUND": { statusCode: 404, errorCode: "5001", message: "Stock data not found from stock exchange." },
    "NOT_ABLE_TO_FETCH_DATA": { statusCode: 503, errorCode: "5002", message: "Problem occured while fetching data from exchange." },

    "FAILED_CALLING_STOCK_SERVICE": {
        statusCode: 500, 
        errorCode: 4001,
        message: "Failed to call stock service provider."
    },

    "USER_ALREADY_EXIST": { statusCode: 400, errorCode: "6001", message: "User already exist with given name." },
    "MAX_SUPPORTED_USER_LIMIT_REACHED": { statusCode: 500, errorCode: "6002", message: "Maximum supported users limit reached, Can not create new user" },
    "USER_NOT_FOUND": { statusCode: 401, errorCode: "6003", message: "User name or password is wrong." },
    "INVALID_CREDS": { statusCode: 401, errorCode: "6004", message: "User name or password is wrong." },

});
