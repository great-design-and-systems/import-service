'use strict';
var bodyParser = require('body-parser');
var morgan = require('morgan');
var PORT = process.env.PORT || '3000';
var ENV = process.env.APP_ENV || 'dev';
module.exports = function(app) {
    app.set('port', PORT);
    app.use(morgan(ENV));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({
        type: 'application/vnd.api+json'
    }));
};