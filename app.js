/**
 * @author Manoj Jain
 * @since 1.0
 * @version 1.0
*/

'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var os = require('os');
var osUtil = require('os-utils');
var stockRouter = require('./modules/routers/StockTickerRouter');
var userRouter = require('./modules/routers/UserRouter');
var logger = require('./modules/utils/Logger');
var HttpHelper = require('./modules/utils/HttpHelper.js');
var swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
var YAML = require("yamljs");
var swaggerDocument = YAML.load('./modules/swagger/swagger.yaml');
var fs = require('fs');
const configFile = 'modules/config/config.json';
const ErrorCodes = require('./modules/commons/ErrorCodes')
var StockTickerError = require('./modules/commons/StockTickerError');
var Constants = require('./modules/commons/Constants');
const executorlib = require('./modules/utils/Executor');
const authHandler = require('./modules/utils/AuthHandler');

var configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));

var app = express();

    app.use(executorlib.init());
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
    app.use(helmet());
    app.use(Constants.STOCK_TICKER_SERVICE_API_DOCS, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    logger.info("Starting Stock Ticker Service");
    
    app.get(Constants.STOCK_TICKER_SERVICE_HEALTH, function (req, res) {
        var system_health = {};
        const used = process.memoryUsage();
        for (const key in used) {
            system_health[key] = `${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`
        }
        osUtil.cpuUsage(function (usage) {
            var mb = 1 / (Math.pow(1024, 2));
            var totalMem = Number(os.totalmem() * mb).toFixed(2);
            var freeMem = Number(os.freemem() * mb).toFixed(2);
            var cpuUsage = Number(100 * usage).toFixed(2);
            system_health.cpu_usage_percentage = cpuUsage;
            system_health.total_memory_mb = totalMem;
            system_health.free_memory_mb = freeMem;
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(system_health);
        });
    });

    app.get(Constants.STOCK_TICKER_SERVICE_HEARTBEAT, function (req, res) {
        logger.info('Invoked heartbeat api');
        res.status(200).send({ message: 'Invoked heartbeat api' });
    });

    app.use(Constants.STOCK_TICKER_SERVICE_BASE_CONTEXT, authHandler.validateToken, stockRouter);
    app.use(Constants.USER_SERVICE_BASE_CONTEXT, userRouter);

    app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":req[X-Amzn-Trace-Id]" ":user-agent"', {
        stream: logger.accessLoggerStream
    }));

    var httpHelper = new HttpHelper(configData);
    httpHelper.createServer(app);

    process.on('unhandledRejection', (reason, p) => {
        logger.error(reason, 'Unhandled Rejection at Promise', p);
    }).on('uncaughtException', err => {
        logger.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

    app.use(function (err, req, res, next) {
        if (err instanceof StockTickerError) {
            res.status(err.statusCode).send({ message: err.message, code: err.errorCode });
        } else {
            res.status(500).send({ message: JSON.stringify(err), code: ErrorCodes.INTERNAL_SERVER_ERROR.errorCode });
        }
    });
 
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        res.status(err.status).send({ message: 'Not Found', code: err.status });
    });

module.exports = { app: app, logger: logger };
