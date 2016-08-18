'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(callback) {
    ImportTracker.find({
        status: 'FAILED'
    }, function(err, result) {
        if (err) {
            console.error('get-import-failed', err);
            callback(undefined, []);
        } else {
            callback(undefined, result);
        }
    });
}

module.exports = execute;