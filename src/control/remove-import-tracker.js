'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(importId, callback) {
    ImportTracker.findByIdAndRemove(importId, function(err) {
        if (err) {
            console.error('remove-import-tracker', err);
            callback({
                message: 'Failed removing import ' + importId
            });
        } else {
            callback();
        }
    });
}

module.exports = execute;