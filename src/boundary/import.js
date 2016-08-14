'use strict';
var CreateImportTracker = require('../control/create-import-tracker');

module.exports = {
  createImportCSV: createImportCSV
};

function createImportCSV(description, limit, callback) {
  new CreateImportTracker({
    description: description,
    type: 'csv_importer',
    progressLimit: limit
  }, function (errCreateImport, resultCreateImport) {
    if (errCreateImport) {
      callback(errCreateImport);
    } else {
      callback(undefined, {
        importId: resultCreateImport._id
      });
    }
  });
}