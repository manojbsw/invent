/**
 * Router for Stock ticker, This will expose all the REST END point to communicate with rest ticker service.
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
*/

const express = require('express');
var common = require("../commons/CommonResponseProcessor");
var schemaValidator = require('../validators/SchemaValidator');
var stockValidator = require('../validators/StockRequestValidator');
const logger = require('../utils/Logger');
const stockTickerService = require('../services/StockTickerService')

const router = express.Router();

router.post('/eod', schemaValidator.validate(stockValidator.stockTickerSearch), (req, res) => {
  
  const startTime = new Date();

  stockTickerService.getStockTicker(req.body)
    .then((result) => {
      const diff = new Date() - startTime;
      logger.info(`Found Stock ticker in ${diff} ms`);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(204).send();
      }
    }, (rej) => {
      common.handleErrorResponse(res, rej);
  }).catch((err) => {
    common.handleErrorResponse(res, err)
  });
});

module.exports = router;
