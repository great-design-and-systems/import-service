'use strict';
var ImportTracker = require('../entity/import-tracker');
var logger = require('./get-logger');

function execute(importId, callback) {
    ImportTracker.findByIdAndUpdate(importId, {
        status: 'COMPLETED'
    }, function(err) {
        if (!err) {
            callback();
        } else {
            logger.error('update-import-status-completed', err);
            callback({
                message: 'Failed updating status to completed.'
            });
        }
    });
}

module.exports = execute;