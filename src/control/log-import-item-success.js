'use strict';
var ImportLog = require('../entity/import-log');
var logger = require('./get-logger');

function execute(importId, columns, items, progressCount, callback) {
    ImportLog.create({
        importId: importId,
        columns: columns,
        items: items,
        status: 'SUCCESS',
        description: 'Successful import for ' + items,
        progressCount: progressCount
    }, function(err) {
        if (err) {
            logger.error('log-import-item-failed', err);
            if (callback) {
                callback({
                    message: 'Failed creating new import log.'
                });
            }

        } else {
            if (callback) {
                callback(undefined);
            }
        }
    });
}

module.exports = execute;