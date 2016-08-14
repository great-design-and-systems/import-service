'use strict';
var mongoose = require('mongoose');

module.exports = function () {
    var PORT = process.env.DB_PORT || 27017;
    var HOST = process.env.DB_HOST || 'localhost';
    var DB = process.env.DB || 'import';
    var USER = process.env.DB_USER;
    var PASSWORD = process.env.DB_PASSWORD;
    var RETRY_COUNT = process.env.RETRY_COUNT || 10;

    function connect(tries) {
        if (!tries) {
            tries = 0;
        }
        if (tries < RETRY_COUNT) {
            mongoose.connect(getDBUrl(), function (err) {
                if (err) {
                    console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                    tries++;
                    setTimeout(connect, 5000);
                }
            });
        } else {
            throw 'Failed to connect to database';
        }
    }

    connect();

    function getDBUrl() {
        var url = 'mongodb://';
        if (USER && PASSWORD) {
            url += USER;
            url += ':'+PASSWORD;
            url += '@';
        }
        url += HOST;
        url += ':';
        url += PORT;
        url += '/';
        url += DB;
        console.log('mongo:' + url);
        return url;
    }
};
