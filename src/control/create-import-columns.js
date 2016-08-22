'use strict';
var ImportColumns = require('../entity/import-columns');
var logger = require('./get-logger');

function execute(importId, columns, callback) {
    ImportColumns.create({
        importId: importId,
        columns: columns
    }, function(err, created) {
        if (err) {
            logger.error('create-import-columns', err);
            callback({
                message: 'Failed creating new import columns.'
            });
        } else {
            callback(undefined, created);
        }
    });
}

module.exports = execute;