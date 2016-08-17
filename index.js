var Database = require('./src/config/database');
var Server = require('./src/config/server');
var LoggerServer = require('./src/config/logger-server');
var express = require('express');
var app = express();
var http = require('http');
var ImportResource = require('./src/boundary/import-resource');
var InitServices = require('./src/config/init-services');
(function() {
    new InitServices(function(err, services) {
        if (err) {
            console.error('Service connection failed.', err);
            throw err;
        } else {
            new Database();
            new Server(app);
            new LoggerServer(app);
            new ImportResource(app, services);
        }
    });

})();

module.exports = app;