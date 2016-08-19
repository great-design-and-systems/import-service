'use strict';
var CheckAndGetApi = require('../control/service/check-and-get-api');
var AddServiceAction = require('../control/service/add-service-action');
var lodash = require('lodash');
var changeCase = require('change-case');
var SetDefaultProtocol = require('../control/service/set-default-protocol');

function execute(callback) {
    var servicePorts = [];
    lodash.forEach(process.env, function(value, key) {
        if (key !== 'SCHOOL_CONFIG_SERVICE_PORT' && key.match(/SERVICE_PORT$/g) && !key.match(/.*_ENV_.*_SERVICE_PORT$/g)) {
            console.log('matches', key);
            var port = {};
            lodash.set(port, 'key', key);
            new SetDefaultProtocol(value, function(err, httpLink) {
                lodash.set(port, 'value', httpLink);
            });
            servicePorts.push(port);
        }
    });
    var restServices = {};
    processPorts(servicePorts, restServices, function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(undefined, result);
        }
    });
}

function processPorts(servicePorts, restServices, callback, index) {
    if (!index) {
        index = 0;
    }
    if (index < servicePorts.length) {
        var port = servicePorts[index];
        var serviceName = changeCase.camelCase(port.key.toLowerCase());
        console.log('connecting to ' + serviceName + ': ' + port.value);
        new CheckAndGetApi(port.value, function(err, api) {
            if (err) {
                console.log('failed connecting to ' + serviceName + ': ' + port.value);
                callback(err);
            } else {
                lodash.set(restServices, serviceName, api);
                console.log('connected to ' + serviceName + ': ' + port.value);
                new AddServiceAction(api.links, function(errLink, links) {
                    if (errLink) {
                        callback(errLink);
                    } else {
                        lodash.set(lodash.get(restServices, serviceName), 'links', links);
                        index++;
                        processPorts(servicePorts, restServices, callback, index);
                    }
                });
            }
        });
    } else {
        callback(undefined, restServices);
    }
}

module.exports = execute;