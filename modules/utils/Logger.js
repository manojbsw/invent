/**
 * The logger.
 *
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

'use strict';


//Imports

var logger = require('winston');
var Configuration = require('./Config');
const cls = require('cls-hooked');
var config = Configuration.config;

/** Formats the message based on the dynamic data, if any. */
var formatMessage = function(args) {
    var msg;
    const ns = cls.getNamespace('session');
    if(ns) {
        const txID = ns.get('txID') || '';
        msg = new Date().toISOString() + " - " + args.level + " thread: " + process.pid + " : " + txID + " : " + args.message;
    } else {
        const errorStack = args.meta && args.meta.stack ? args.meta.stack : args.message;
        msg = new Date().toISOString() + " - " + args.level + " : " + args.message + " : " + errorStack;
    }
    return msg;
}

logger.level = process.env.LOG_LEVEL || config.logLevel;
logger.add(logger.transports.File, {
    filename: config.logsDir + "/" + config.logFilePrefix + ".log",
    maxFiles: config.numberOfLogFiles,
    maxsize: config.logFileSize,
    timestamp: true,
    json: false,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    formatter: formatMessage
});
    


Configuration.configEvents.on('change', function(oldConfig, newConfig) {
    if (oldConfig.logLevel !== newConfig.logLevel) {
        logger.level = newConfig.logLevel;
        logger.info('Log level update to ' + newConfig.logLevel);
    }
});

var accessLogger = new logger.Logger({
    transports: [
        new logger.transports.File({
            level: 'info',
            filename: config.logsDir + "/access.log",
            maxFiles: config.numberOfAccessLogFiles,
            maxsize: config.accessLogFileSize,
            json: false,
            handleExceptions: false,
            humanReadableUnhandledException: true,
            formatter: function(args) {
                return args.message;
            }
        })
    ],
    exitOnError: false
});

accessLogger.stream = {
    write: function(message) {
        accessLogger.info(message.trim());
    }
};

function isDebugEnabled() {
    return logger.levels[logger.level] >= logger.levels['debug'] ? true : false
}

module.exports = logger;
module.exports.accessLoggerStream = accessLogger.stream;
module.exports.isDebugEnabled = isDebugEnabled;