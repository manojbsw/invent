var sinon = require('sinon');
var assert = require('chai').assert;
var expect = require('chai').expect;
var stockTickerService = require('../../../modules/services/StockTickerService');
const marketStackServiceClient = require('../../../modules/clients/MarketStackServiceClient')
const ErrorCodes = require('../../../modules/commons/ErrorCodes');
const StockTickerError = require('../../../modules/commons/StockTickerError');

function stockTickerServiceTest() {
  
}

stockTickerServiceTest.prototype.test = function (){
        
        describe('Get EOD stock price:', function (){
        it('Get EOD stock price for correct stock symbol', (done) => {
            var tickerRequest = {
                symbol: "TCS",
                date: "2021-05-20"
              }
             var tickerResponse = {
                open: 29.01,
                close: 29.64,
                low: 28.91,
                high: 29.7,
                volume: 81786282,
                symbol: "T",
                exchange: "XNYS",
                date: "2021-05-20T00:00:00+0000"
              } 
            sinon.stub(marketStackServiceClient, 'getStockTicker').withArgs(tickerRequest).returns(Promise.resolve(tickerResponse));
            stockTickerService.getStockTicker(tickerRequest)
            .then((result) =>{
                assert(result.open === 29.01);
                assert(result.close === 29.64);
                assert(result.low === 28.91);
                assert(result.high === 29.7);
                assert(result.volume === 81786282);
                assert(result.symbol === 'T');
                done();
            }).finally(() => marketStackServiceClient.getStockTicker.restore());
        }),
        it('Get EOD stock price for in-correct stock symbol', (done) => {
            var tickerRequest = {
                symbol: "TCSS",
                date: "2021-05-20"
              }
            sinon.stub(marketStackServiceClient, 'getStockTicker').withArgs(tickerRequest).returns(Promise.reject(new StockTickerError(ErrorCodes.STOCK_DETAIL_NOT_FOUND.message, ErrorCodes.STOCK_DETAIL_NOT_FOUND)));
            stockTickerService.getStockTicker(tickerRequest)
            .then((result) =>{
                
            },(rej)=>{
                expect(rej.errorCode).to.equal(ErrorCodes.STOCK_DETAIL_NOT_FOUND.errorCode);
                done();
            }).finally(() => marketStackServiceClient.getStockTicker.restore());
        });
    });

}

module.exports = stockTickerServiceTest;