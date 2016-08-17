'use strict';
var batch = require('batchflow');

function execute(data, track, callback) {
    var columns = [];
    batch(data).sequential()
        .each(function(i, item, next) {
            if (i > 0) {
                track(columns, item, i, next);
            } else {
                columns = item;
                next();
            }
        })
        .end(callback);
}
module.exports = execute;