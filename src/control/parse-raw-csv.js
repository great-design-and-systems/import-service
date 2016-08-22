'use strict';
var parse = require('csv-parse');
var logger = require('./get-logger');

function execute(rawEncoded, callback) {
    parse(rawEncoded, { comment: '#' },
        function(err, data) {
            if (err) {
                logger.error('parse-raw-csv', err);
                callback({
                    message: 'Error parsing csv file.'
                });
            } else {
                callback(undefined, data);
            }
        });
}

module.exports = execute;