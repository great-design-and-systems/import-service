'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(callback) {
    ImportTracker.find({
        status: 'COMPLETED'
    }, function(err, result) {
        if (err) {
            console.error('get-import-completed', err);
            callback(undefined, []);
        } else {
            callback(undefined, result);
        }
    });
}

module.exports = execute;