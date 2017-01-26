var Database = require('./src/config/database');
var Server = require('./src/config/server');
var LoggerServer = require('./src/config/logger-server');
var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');
var GDSUtil = require('gds-config').GDSUtil;
var ImportResource = require('./src/boundary/import-resource');
var InitServices = require('./src/config/init-services');
var Socket = require('./src/config/socket');
(function () {
    new InitServices(function (err, services) {
        if (err) {
            console.error('Service connection failed.', err);
            throw err;
        } else {
            new Database();
            new Server(app);
            new LoggerServer(app);
            new GDSUtil().initEvents(function () {
                new Socket(app, io, http, function (err, sockets) {
                    new ImportResource(app, services, sockets);
                });
            });
        }
    });

})();

module.exports = app;