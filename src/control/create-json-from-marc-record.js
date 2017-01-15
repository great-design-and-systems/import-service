'use strict';
var marc4js = require('marc4js');
var logger = require('./get-logger');

function execute(marcRecord, callback) {
    marc4js.transform(marcRecord, { format: 'json' }, function (err, data) {
        if (err) {
            logger.error('create-json-format-from-columns', err);
            callback({
                message: 'Error creating json object for marc record.'
            });
        } else {
            callback(undefined, JSON.parse(data));
        }
    });
}

module.exports = execute;