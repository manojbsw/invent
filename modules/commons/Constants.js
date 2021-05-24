/** 
* Constants declaration
* @author Manoj Jain
 * @since 1.0
 * @version 1.0
*/


var constants = {

    STOCK_TICKER_SERVICE_BASE_CONTEXT : "/api/v1/ticker",
    STOCK_TICKER_SERVICE_API_DOCS: "/api-docs",
    STOCK_TICKER_SERVICE_HEALTH: "/api/v1/ticker/health",
    STOCK_TICKER_SERVICE_HEARTBEAT: "/heartbeat",

    USER_SERVICE_BASE_CONTEXT : "/api/v1/user",
    MAX_USER_ALLOWED:1000,

    
    HEADER_TRANS_ID: "x-transaction-id",

};

module.exports = constants;