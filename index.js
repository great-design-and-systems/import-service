var Database = require('./src/config/database');
var Server = require('./src/config/server');
var LoggerServer = require('./src/config/logger-server');
var express = require('express');
var app = express();
var http = require('http');
var ImportResource = require('./src/boundary/import-resource');
(function () {
    new Database();
    new Server(app);
    new LoggerServer(app);
    new ImportResource(app);
})();

module.exports = app;
