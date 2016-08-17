'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(importId, callback) {
    ImportTracker.findByIdAndUpdate(importId, {
        status: 'COMPLETED'
    }, function(err) {
        if (!err) {
            callback();
        } else {
            console.error('update-import-status-completed', err);
            callback({
                message: 'Failed updating status to completed.'
            });
        }
    });
}

module.exports = execute;