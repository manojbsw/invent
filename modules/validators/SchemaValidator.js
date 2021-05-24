/**
 * The Stock Ticker Service API's request validator.
 *
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */

const StockTickerError = require("../commons/StockTickerError");
const errorCodes = require("../commons/ErrorCodes");
const logger = require("../utils/Logger");
var commonResponseProcessor = require("../commons/CommonResponseProcessor");
const _ = require("lodash");

module.exports = {
  validate: (schema) => {
    return function (req, res, next) {
      const { error } = schema.validate(req.body);
      if (error) {
        const CustomJOIError = {
          details: _.map(error.details, ({ message, path, type, context }) => ({
            message: message.replace(/['"]/g, ""),
            path,
            type,
            element_name: context.path,
          })),
        };
        logger.debug("Error in schema validation");
        commonResponseProcessor.handleErrorResponse(
          res,
          new StockTickerError(CustomJOIError, errorCodes.INVALID_REQUEST)
        );
      } else {
        next();
      }
    };
  },
};
