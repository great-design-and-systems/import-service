'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(importId, progressCount, callback) {
    ImportTracker.findByIdAndUpdate(importId, {
        progressCount: progressCount
    }, function(err) {
        if (!err) {
            callback();
        } else {
            console.error('update-tracker-count-by-id', err);
            callback({
                message: 'Failed updating count.'
            });
        }
    });
}

module.exports = execute;