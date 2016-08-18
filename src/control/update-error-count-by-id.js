'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(importId, errorCount, callback) {
    ImportTracker.findByIdAndUpdate(importId, {
        errorCount: errorCount
    }, function(err) {
        if (!err) {
            if (callback) {
                callback();
            }
        } else {
            console.error('update-error-count-by-id', err);
            if (callback) {
                callback({
                    message: 'Failed updating error count.'
                });
            }
        }
    });
}

module.exports = execute;