'use strict';
var ImportTracker = require('../entity/import-tracker');
var logger = require('./get-logger');

function execute(importId, errorCount, callback) {
    ImportTracker.findByIdAndUpdate(importId, {
        errorCount: errorCount
    }, function(err) {
        if (!err) {
            if (callback) {
                callback();
            }
        } else {
            logger.error('update-error-count-by-id', err);
            if (callback) {
                callback({
                    message: 'Failed updating error count.'
                });
            }
        }
    });
}

module.exports = execute;