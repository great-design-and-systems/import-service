'use strict';
var CreateImportTracker = require('../control/create-import-tracker');
var CreateImportColumns = require('../control/create-import-columns');
module.exports = {
    createImportCSV: createImportCSV,
    createImportCSVColumns: createImportCSVColumns
};

function createImportCSV(description, limit, dataFor, callback) {
    new CreateImportTracker({
        description: description,
        type: 'csv_importer',
        progressLimit: limit,
        dataFor: dataFor
    }, function(errCreateImport, resultCreateImport) {
        if (errCreateImport) {
            callback(errCreateImport);
        } else {
            callback(undefined, {
                importId: resultCreateImport._id
            });
        }
    });
}

function createImportCSVColumns(importId, columns, callback) {
    new CreateImportColumns(importId, columns, function(err) {
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
}