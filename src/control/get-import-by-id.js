'use strict';
var ImportTracker = require('../entity/import-tracker');
var logger = require('./get-logger');

function execute(importId, callback) {
    ImportTracker.findById(importId, function(err, importTracker) {
        if (err) {
            logger.error('get-import-by-id', err);
            callback({
                message: 'ImportId ' + importId + ' not found'
            });
        } else {
            callback(undefined, importTracker);
        }
    });
}

module.exports = execute;