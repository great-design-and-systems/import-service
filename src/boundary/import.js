'use strict';
var CreateImportTracker = require('../control/create-import-tracker');
var CreateImportColumns = require('../control/create-import-columns');
var ParseRawCSV = require('../control/parse-raw-csv');
var ParseRawMarc = require('../control/parse-raw-marc');
var GetImportById = require('../control/get-import-by-id');
var IterateCSVByBatch = require('../control/iterate-csv-by-batch');
var CreateJsonFormatFromColumns = require('../control/create-json-format-from-columns');
var UpdateTrackerCountById = require('../control/update-tracker-count-by-id');
var UpdateImportStatusToProgress = require('../control/update-import-status-to-inprogress');
var UpdateImportStatusToCompleted = require('../control/update-import-status-to-completed');
var LogImportItemFailed = require('../control/log-import-item-failed');
var LogImportItemSuccess = require('../control/log-import-item-success');
var GetImportFailed = require('../control/get-import-failed');
var GetImportCompleted = require('../control/get-import-completed');
var GetImportProgress = require('../control/get-import-progress');
var GetImportLogs = require('../control/get-import-logs');
var RemoveImportTracker = require('../control/remove-import-tracker');
var UpdateErrorCountById = require('../control/update-error-count-by-id');
var logger = require('../control/get-logger');

module.exports = {
    runImportCSV: runImportCSV,
    createImportCSV: createImportCSV,
    createImportMarc: createImportMarc,
    getImportFailed: getImportFailed,
    getImportCompleted: getImportCompleted,
    getImportProgress: getImportProgress,
    getImportLogs: getImportLogs,
    removeImportTracker: removeImportTracker
};

function runImportCSV(importId, services, track, callback) {
    new UpdateImportStatusToProgress(importId, function (err) {
        if (!err) {
            new GetImportById(importId, function (err, importTracker) {
                if (!err) {
                    logger.info('importTracker', importTracker);
                    services.fileServicePort.links.downloadFile.execute({
                        params: {
                            fileId: importTracker.fileId
                        }
                    }, function (errFile, result) {
                        if (!errFile) {
                            new ParseRawCSV(result.response.rawEncoded, function (errParse, parsedCsv) {
                                if (!errParse) {
                                    var errorCount = 0;
                                    new IterateCSVByBatch(parsedCsv, function (columns, item, itemCount, next) {
                                        new CreateJsonFormatFromColumns(columns, item, function (errJsonFormat, jsonFormatObject) {
                                            if (!errJsonFormat) {
                                                if (importTracker.dataFor === 'student') {
                                                    services.studentServicePort.links.createStudent.execute({
                                                        data: jsonFormatObject
                                                    }, function (errStudentSave) {
                                                        if (errStudentSave) {
                                                            //should log
                                                            logger.error('import', errStudentSave);
                                                            errorCount++;
                                                            new LogImportItemFailed(importId, columns, item, itemCount);
                                                            new UpdateErrorCountById(importId, errorCount);
                                                        } else {
                                                            new LogImportItemSuccess(importId, columns, item, itemCount);
                                                            new UpdateTrackerCountById(importId, itemCount, function (errUpdateTracker) {
                                                                if (!errUpdateTracker) {
                                                                    track(jsonFormatObject, itemCount);
                                                                }
                                                            });
                                                        }
                                                        next();
                                                    });
                                                } else if (importTracker.dataFor === 'faculty') {
                                                    services.facultyServicePort.links.createFaculty.execute({
                                                        data: jsonFormatObject
                                                    }, function (errFacultySave) {
                                                        if (errFacultySave) {
                                                            //should log
                                                            errorCount++;
                                                            logger.error('import', errFacultySave);
                                                            new LogImportItemFailed(importId, columns, item, itemCount);
                                                            new UpdateErrorCountById(importId, errorCount);
                                                        } else {
                                                            new LogImportItemSuccess(importId, columns, item, itemCount);
                                                            new UpdateTrackerCountById(importId, itemCount, function (errUpdateTracker) {
                                                                if (!errUpdateTracker) {
                                                                    track(jsonFormatObject, itemCount);
                                                                }
                                                            });
                                                        }
                                                        next();
                                                    });
                                                }
                                            } else {
                                                callback(errJsonFormat);
                                            }
                                        });
                                    }, function () {
                                        new UpdateImportStatusToCompleted(importId, function () {
                                            callback();
                                        });
                                    });
                                } else {
                                    callback(errParse);
                                }
                            });
                        } else {
                            callback(errFile);
                        }
                    });
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    });
}

function createImportCSV(description, fileId, dataFor, rawEncoded, callback) {
    new ParseRawCSV(rawEncoded, function (errParsing, data) {
        new CreateImportTracker({
            description: description,
            type: 'csv_importer',
            progressLimit: (data.length - 1),
            dataFor: dataFor,
            fileId: fileId
        }, function (errCreateImport, resultCreateImport) {
            if (errCreateImport) {
                callback(errCreateImport);
            } else {
                new CreateImportColumns(resultCreateImport._id, data[0], function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(undefined, {
                            importId: resultCreateImport._id
                        });
                    }
                });

            }
        });
    });
}

function createImportMarc(description, fileId, dataFor, rawEncoded, callback) {
    new ParseRawMarc(rawEncoded, function (errParsing, data) {
        new CreateImportTracker({
            description: description,
            type: 'marc_importer',
            progressLimit: (data.length - 1),
            dataFor: dataFor,
            fileId: fileId
        }, function (errCreateImport, resultCreateImport) {
            if (errCreateImport) {
                callback(errCreateImport);
            } else {
                callback(undefined, {
                    importId: resultCreateImport._id
                });
            }
        });
    });
}

function getImportFailed(callback) {
    new GetImportFailed(callback);
}

function getImportCompleted(callback) {
    new GetImportCompleted(callback);
}

function getImportProgress(callback) {
    new GetImportProgress(callback);
}

function getImportLogs(importId, callback) {
    new GetImportLogs(importId, callback);
}

function removeImportTracker(importId, callback) {
    new RemoveImportTracker(importId, callback);
}