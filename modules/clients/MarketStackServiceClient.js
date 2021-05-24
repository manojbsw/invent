/**
 * This class provides the implementation to access stock ticker using API exposed by https://marketstack.com
 *
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */

// load configuration details
const fs = require('fs');
const logger = require('../utils/Logger');
const RestClient = require('./RestClient');
var ErrorCodes = require('../commons/ErrorCodes');
var StockTickerError = require('../commons/StockTickerError');
const configFile = 'modules/config/config.json';
const configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));

const restClient = new RestClient();
const marketStackSrviceURL = process.env.marketStackSrviceURL || configData.marketStackSrviceURL;
const marketStackAccessKey = process.env.marketStackAccessKey || configData.marketStackAccessKey;

module.exports = {
  getStockTicker: (tickerRequest) => new Promise((resolve, reject) => {
    
    const symbol = tickerRequest.symbol;
    const date = tickerRequest.date == undefined ? 'latest' : tickerRequest.date;
    const getStockTickerURL = `${marketStackSrviceURL}/v1/tickers/${symbol}/eod/${date}?access_key=${marketStackAccessKey}`;
    const headerInfo = {
      'Content-Type': 'application/json'
    };
    
    if (logger.isDebugEnabled()) {
      logger.debug(`Getting ticker details for symbol ${symbol}`);
    }

    restClient.getRequest(getStockTickerURL, headerInfo).then((result) => {
      
      if(result && result.statusCode===200 && result.body) {
        var data = result.body;
        var response = {
          open:data.open,
          close:data.close,
          low:data.low,
          high:data.high,
          volume:data.volume,
          symbol:data.symbol,
          exchange:data.exchange,
          date:data.date
        };
        resolve(response);
      }
    }, (rej) => {
      logger.error(`Failled to get stock ticker for symbol ${symbol}: ${rej}`);
      if(rej && rej.statusCode===404) {
        reject(new StockTickerError(ErrorCodes.STOCK_DETAIL_NOT_FOUND.message, ErrorCodes.STOCK_DETAIL_NOT_FOUND));
      } else {
        reject(new StockTickerError(ErrorCodes.NOT_ABLE_TO_FETCH_DATA.message, ErrorCodes.NOT_ABLE_TO_FETCH_DATA));  
      }
    }).catch((error) => {
      logger.error(`Failled to get stock ticker for symbol ${symbol}: ${error}`);
      reject(new StockTickerError(ErrorCodes.NOT_ABLE_TO_FETCH_DATA.message, ErrorCodes.NOT_ABLE_TO_FETCH_DATA));  
    });
  }),
};
