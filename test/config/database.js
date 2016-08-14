'use strict';
var mongoose = require('mongoose');

module.exports = function (done) {
    var PORT = process.env.DB_PORT_TEST || 27017;
    var HOST = process.env.DB_HOST_TEST || 'localhost';
    var TEST_DB = process.env.DB_TEST || 'test';
    var USER = process.env.DB_USER;
    var PASSWORD = process.env.DB_PASSWORD;

    return {
        connect: connect,
        disconnect: disconnect
    };

    function connect(done) {
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(getDBUrl(), function (err) {
                if (err) {
                    throw err;
                }
                return clearDB(done);
            });
        } else {
            return clearDB(done);
        }
    }

    function getDBUrl() {
        var url = 'mongodb://';
        if (USER && PASSWORD) {
            url += USER;
            url += ':';
            url += PASSWORD;
            url += '@';
        }
        url += HOST;
        url += ':';
        url += PORT;
        url += '/';
        url += TEST_DB;
        console.log('mongo:' + url);
        return url;
    }

    function clearDB(done) {
        for (var i in mongoose.connection.collections) {
            if (mongoose.connection.collections[i] && mongoose.connection.collections[i].drop) {
                mongoose.connection.collections[i].drop(function (err) {
                    console.log('collection dropped');
                });
            }
        }
        return done();
    }

    function disconnect(done) {
        mongoose.disconnect();
        return done();
    }
};