'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(importId, callback) {
    ImportTracker.findByIdAndUpdate(importId, {
        status: 'INPROGRESS'
    }, function(err) {
        if (!err) {
            callback();
        } else {
            console.error('update-import-status-inprogress', err);
            callback({
                message: 'Failed updating status to in-progress.'
            });
        }
    });
}

module.exports = execute;