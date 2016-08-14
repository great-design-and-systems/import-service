'use strict';
var ImportTracker = require('../entity/import-tracker');

function execute(trackerData, callback) {
  ImportTracker.create(trackerData, function(err, createdTracker) {
    if (err) {
      console.error('create-import-tracker', err);
      callback({
        message: 'Failed creating new import tracker.'
      });
    } else {
      callback(undefined, createdTracker);
    }
  });
}

module.exports = execute;