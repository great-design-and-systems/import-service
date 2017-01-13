'use strict';
var marc4js = require('marc4js');
var logger = require('./get-logger');

function execute(rawEncoded, callback) {
    marc4js.parse(rawEncoded, {}, function (err, records) {
        if (err) {
            logger.error('parse-raw-marc', err);
            callback({
                message: 'Error parsing marc file.'
            });
        } else {
            callback(undefined, records);
        }
    });
}

module.exports = execute;