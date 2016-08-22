'use strict';
var ImportTracker = require('../entity/import-tracker');
var logger = require('./get-logger');

function execute(callback) {
    ImportTracker.find({
        status: 'FAILED'
    }, function(err, result) {
        if (err) {
            logger.error('get-import-failed', err);
            callback(undefined, []);
        } else {
            callback(undefined, result);
        }
    });
}

module.exports = execute;