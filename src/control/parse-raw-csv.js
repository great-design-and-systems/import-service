'use strict';
var parse = require('csv-parse');

function execute(rawEncoded, callback) {
    parse(rawEncoded, { comment: '#' },
        function(err, data) {
            if (err) {
                console.error('parse-raw-csv', err);
                callback({
                    message: 'Error parsing csv file.'
                });
            } else {
                callback(undefined, data);
            }
        });
}

module.exports = execute;