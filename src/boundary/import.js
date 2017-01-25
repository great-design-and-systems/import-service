'use strict';
var CreateImportTracker = require('../control/create-import-tracker');
var CreateImportColumns = require('../control/create-import-columns');
var ParseRawCSV = require('../control/parse-raw-csv');
var ParseRawMarc = require('../control/parse-raw-marc');
var GetImportById = require('../control/get-import-by-id');
var IterateCSVByBatch = require('../control/iterate-csv-by-batch');
var IterateMarcByBatch = require('../control/iterate-marc-by-batch');
var CreateJsonFormatFromColumns = require('../control/create-json-format-from-columns');
var CreateJsonFromMarcRecord = require('../control/create-json-from-marc-record');
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
var GDSEventJobs = require('gds-config').GDSEventJobs;

module.exports = {
    runImportCSV: runImportCSV,
    runImportMarc: runImportMarc,
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

function runImportMarc(importId, services, track, callback) {
    new UpdateImportStatusToProgress(importId, function (err) {
        if (err) {
            callback(err);
        } else {
            new GetImportById(importId, function (err, importTracker) {
                if (err) {
                    callback(err);
                } else {
                    logger.info('marc-importTracker', importTracker);
                    services.fileServicePort.links.downloadFile.execute({
                        params: {
                            fileId: importTracker.fileId
                        }
                    }, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            new ParseRawMarc(result.response.rawEncoded, function (errParse, parsedMarc) {
                                if (errParse) {
                                    callback(errParse);
                                } else {
                                    var errorCount = 0;
                                    new IterateMarcByBatch(parsedMarc, function (marcRecord, recordCount, next) {
                                        new CreateJsonFromMarcRecord(marcRecord, function (errJsonFormat, marcJson) {
                                            if (errJsonFormat) {
                                                callback(errJsonFormat);
                                            } else {
                                                // Item.createItem
                                                // item.name = title
                                                // item.category = importTracker.dataFor
                                                // Category.createItemCategory
                                                // {
                                                //     "category": importTracker.dataFor,
                                                //     "content": {
                                                //         "itemId": result._id of item- service,
                                                //         "author": marc 100 or 245 subfield c,
                                                //         "edition": 250,
                                                //         "imprint": {
                                                //             [{"publicationPlace": 260 a, "publisher": 260 b},{"publicationPlace": 260 a, "publisher": 260 b}],
                                                //             "publicationDate": 260 c
                                                //         },
                                                //         "marc" : marcRecord text format
                                                //     }
                                                // }
                                                // }
                                                marcJson.itemId = '$data.itemId;';
                                                new GDSEventJobs().createProcedureJob('SAVE_MARC_DETAILS', 'SYSTEM')
                                                    .setNextEvent('CREATE_ITEM_RECORD','Items.createItem')
                                                    .addBody('name', marcJson.title)
                                                    .addBody('category', importTracker.dataFor)
                                                    .setNextEvent('CREATE_CATEGORY_ITEM', 'Category.createItemCategory')
                                                    .addBody('category', importTracker.dataFor)
                                                    .addBody('content', JSON.stringify(marcJson))
                                                    .execute(function (err) {
                                                        if (err) {
                                                            console.err(err);
                                                            logger.error('run-import-marc', err);
                                                            new LogImportItemFailed(importId, '', marcJson, recordCount);
                                                            new UpdateErrorCountById(importId, ++errorCount);
                                                        } else {
                                                            new LogImportItemSuccess(importId, '', marcJson, recordCount);
                                                            new UpdateTrackerCountById(importId, recordCount, function (errUpdateTracker) {
                                                                if (!errUpdateTracker) {
                                                                    track(marcJson, recordCount);
                                                                }
                                                            });
                                                        }
                                                    });
                                                console.log('recordCount', recordCount);
                                                console.log(marcJson);
                                            }
                                            next();
                                        });
                                    }, function () {
                                        new UpdateImportStatusToCompleted(importId, function () {
                                            callback();
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
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