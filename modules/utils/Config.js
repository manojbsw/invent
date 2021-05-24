/**
 * The configuration.
 *
 * @author Manoj Jain
 * @version 1.0
 * @since 1.0
 */

'use strict';
var fs = require('fs');
var chokidar = require('chokidar');
const path = require('path')
var configFile = '../config/config.json';
var events = require('events');
const configFileAbsPath = path.join(__dirname, configFile);
var currentConfig = JSON.parse(fs.readFileSync(configFileAbsPath, 'utf8'));
var configEvents = new events.EventEmitter();
var fsWatcher;

var generateConfigChangeEvent = function(oldConfig, newConfig) {
    configEvents.emit('change', oldConfig, newConfig);
}

var loadFileAndFireEvent = function(configFilePath) {
    var fileContents = fs.readFileSync(configFilePath, 'utf8');
    if (fileContents) {
        var newConfig = JSON.parse(fileContents);
        generateConfigChangeEvent(currentConfig, newConfig);
        currentConfig = newConfig;
    }
}

var configFileChangeMonitor = function() {
    if (fs.existsSync(configFileAbsPath)) {
        fsWatcher = chokidar.watch(configFileAbsPath);
        fsWatcher.on('change', function() {
            loadFileAndFireEvent(configFileAbsPath);
        });
    }
}

configFileChangeMonitor();

exports.config = currentConfig;
exports.configEvents = configEvents;