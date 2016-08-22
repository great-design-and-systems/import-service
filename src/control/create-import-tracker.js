'use strict';
var ImportTracker = require('../entity/import-tracker');
var logger = require('./get-logger');

function execute(trackerData, callback) {
  ImportTracker.create(trackerData, function(err, createdTracker) {
    if (err) {
      logger.error('create-import-tracker', err);
      callback({
        message: 'Failed creating new import tracker.'
      });
    } else {
      callback(undefined, createdTracker);
    }
  });
}

module.exports = execute;