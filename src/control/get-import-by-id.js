'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(importId, callback) {
    ImportTracker.findById(importId, function(err, importTracker) {
        if (err) {
            console.error('get-import-by-id', err);
            callback({
                message: 'ImportId ' + importId + ' not found'
            });
        } else {
            callback(undefined, importTracker);
        }
    });
}

module.exports = execute;