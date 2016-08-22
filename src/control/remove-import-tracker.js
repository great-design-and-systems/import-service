'use strict';
var ImportTracker = require('../entity/import-tracker');
var logger = require('./get-logger');

function execute(importId, callback) {
    ImportTracker.findByIdAndRemove(importId, function(err) {
        if (err) {
            logger.error('remove-import-tracker', err);
            callback({
                message: 'Failed removing import ' + importId
            });
        } else {
            callback();
        }
    });
}

module.exports = execute;