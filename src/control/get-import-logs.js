'use strict';
var ImportLog = require('../entity/import-log');
var logger = require('./get-logger');

function execute(importId, callback) {
    ImportLog.find({
        importId: importId
    }, function(err, result) {
        if (err) {
            logger.error('get-import-logs', err);
            callback(undefined, []);
        } else {
            callback(undefined, result);
        }
    });
}

module.exports = execute;