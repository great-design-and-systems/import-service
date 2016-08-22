'use strict';
var lodash = require('lodash');
var logger = require('./get-logger');

function execute(columns, item, callback) {
    var jsonFormat = {};
    try {
        lodash.forEach(columns, function(field, index) {
            lodash.set(jsonFormat, field, item[index]);
        });
        callback(undefined, jsonFormat);
    } catch (err) {
        logger.error('create-json-format-from-columns', err);
        callback({
            message: 'Error creating json format for item: ' + item + '.'
        });
    }
}

module.exports = execute;