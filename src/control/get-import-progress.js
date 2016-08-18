'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(callback) {
    ImportTracker.find({
        status: 'INPROGRESS'
    }, function(err, result) {
        if (err) {
            console.error('get-import-progress', err);
            callback(undefined, []);
        } else {
            callback(undefined, result);
        }
    });
}

module.exports = execute;