'use strict';
var log4js = require('log4js');
var APP_NAME = process.env.APP_NAME || 'import_service';

module.exports = log4js.getLogger(APP_NAME);