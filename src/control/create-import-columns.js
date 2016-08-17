'use strict';
var ImportColumns = require('../entity/import-columns');

function execute(importId, columns, callback) {
    ImportColumns.create({
        importId: importId,
        columns: columns
    }, function(err, created) {
        if (err) {
            console.error('create-import-columns', err);
            callback({
                message: 'Failed creating new import columns.'
            });
        } else {
            callback(undefined, created);
        }
    });
}

module.exports = execute;