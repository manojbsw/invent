/**
 * The Stock-Ticker Service API's request validation with Joi.
 *
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
 */

const Joi = require('joi');

const stockTickerSearch = Joi.object().keys({
    symbol: Joi.string().trim().min(3).max(8).required(),
    date: Joi.date().max(new Date())
});

module.exports = { stockTickerSearch}
