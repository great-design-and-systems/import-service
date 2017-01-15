'use strict';
var batch = require('batchflow');

function execute(data, track, callback) {
    batch(data).sequential()
        .each(function(index, record, next) {
            track(record, index, next);
        })
        .end(callback);
}
module.exports = execute;