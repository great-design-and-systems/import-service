'use strict';
var restler = require('restler');
var RETRY_COUNT = process.env.RETRY_COUNT || 20;

function execute(apiUrl, callback) {
    var retry = 0;
    restler.get(apiUrl, {
        timeout: 50000
    }).on('success', function(data) {
        callback(undefined, data);
    }).on('error', function(reason) {
        if (retry === RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(5000);
    }).on('fail', function(reason) {
        if (retry === RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(5000);
    }).on('timeout', function(reason) {
        if (retry === RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(5000);
    });
}
module.exports = execute;