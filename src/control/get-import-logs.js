'use strict';
var ImportLog = require('../entity/import-log');

function execute(importId, callback) {
    ImportLog.find({
        importId: importId
    }, function(err, result) {
        if (err) {
            console.error('get-import-logs', err);
            callback(undefined, []);
        } else {
            callback(undefined, result);
        }
    });
}

module.exports = execute;