const express = require('express');

const router = express.Router();
var common = require("../commons/CommonResponseProcessor");
var schemaValidator = require('../validators/SchemaValidator');
var userValidator = require('../validators/UserRequestValidator');
var userService = require('../services/UserService');
const logger = require('../utils/Logger');

router.post('', schemaValidator.validate(userValidator.userValidator), (req, res) => {
  const startTime = new Date();
  logger.info('Started : Creating user.');
  userService.createUser(req.body).then((result) => {
    const diff = new Date() - startTime;
    logger.info(`Completed : User creation in ${diff} ms`);
    res.status(201).send(result);
  }, (rej) => {
    logger.error(rej);
    common.handleErrorResponse(res, rej);
  }).catch((err) => {
    common.handleErrorResponse(res, err);
  });
});

router.post('/login', schemaValidator.validate(userValidator.userValidator), (req, res) => {
  const startTime = new Date();
  logger.info('Started : Authenticating user.');
  userService.validateUser(req.body).then((result) => {
    const diff = new Date() - startTime;
    logger.info(`Completed : User authentication in ${diff} ms`);
    res.status(200).send(result);
  }, (rej) => {
    logger.error(rej);
    common.handleErrorResponse(res, rej);
  }).catch((err) => {
    common.handleErrorResponse(res, err);
  });
});


module.exports = router;
