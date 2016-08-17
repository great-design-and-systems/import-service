'use strict';
var restler = require('restler');
var lodash = require('lodash');
var SetDefaultProtocol = require('./set-default-protocol');

function execute(links, callback) {
    try {
        lodash.forEach(links, function(link) {
            link.execute = action;
        });
        callback(undefined, links);
    } catch (err) {
        console.error('add-service-action', err);
        callback(err);
    }
}

function action(options, callback) {
    /*jshint validthis:true */
    var link = this;
    var url;
    new SetDefaultProtocol(link.url, function(err, httpUrl) {
        url = httpUrl;
    });
    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }
    if (!options) {
        options = {};
    }
    if (!options.timeout) {
        options.timeout = process.env.CALL_TIMEOUT || 20000;
    }
    console.log('options', options);
    var method = 'get';
    if (link.method === 'POST') {
        method = 'post';
    } else if (link.method === 'PUT') {
        method = 'put';
    } else if (link.method === 'DELETE') {
        method = 'del';
    }
    if (options && options.params) {
        lodash.forEach(options.params, function(value, key) {
            url = url.replace(':' + key, value);
        });
    }
    console.log('request made: ' + url);
    lodash.get(restler, method)(url, options)
        .on('success', function(result, response) {
            console.log('request success: ' + url);
            callback(undefined, {
                data: result,
                response: response
            });
        })
        .on('error', function(reason, response) {
            console.error('ERROR: ' + url, reason);
            callback(reason, response);
        })
        .on('fail', function(reason, response) {
            console.error('FAIL: ' + url, reason);
            callback(reason, response);
        })
        .on('timeout', function(reason, response) {
            console.error('TIMEOUT: ' + link.url, reason);
            callback(reason, response);
        });
}

module.exports = execute;