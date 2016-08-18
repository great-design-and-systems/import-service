'use strict';
var API = process.env.API_NAME || '/api/import/';
var Import = require('./import');
module.exports = function(app, services, sockets) {

    app.get('/', function(req, res) {
        res.status(200).send({
            domain: process.env.DOMAIN_NAME || 'Import',
            links: {
                createImportCSV: {
                    method: 'POST',
                    url: 'http://' + req.headers.host + API + 'create-import-csv'
                },
                runImportCsv: {
                    method: 'PUT',
                    url: 'http://' + req.headers.host + API + 'run-import-csv'
                },
                getImportCompleted: {
                    method: 'GET',
                    url: 'http://' + req.headers.host + API + 'get-import-completed'
                },
                getImportFailed: {
                    method: 'GET',
                    url: 'http://' + req.headers.host + API + 'get-import-failed'
                },
                getImportProgress: {
                    method: 'GET',
                    url: 'http://' + req.headers.host + API + 'get-import-progress'
                },
                getImportLogs: {
                    method: 'GET',
                    url: 'http://' + req.headers.host + API + 'get-import-logs/:importId'
                },
                removeImportTracker: {
                    method: 'DELETE',
                    url: 'http://' + req.headers.host + API + 'remove-import-tracker/:importId'
                }
            }
        });
    });

    app.put(API + 'run-import-csv', function(req, res) {
        res.status(200).send({
            message: 'Import started for ' + req.body.importId
        });
        Import.runImportCSV(req.body.importId, services, function(item, itemCount) {
                console.log('tracker', item);
                sockets.emit('import-tracker', { item: item, progress: itemCount });
            },
            function(err) {
                if (err) {
                    console.error('import-resource', err);
                    sockets.emit('import-fail', err);
                } else {
                    sockets.emit('import-complete');
                }

            });
    });
    app.post(API + 'create-import-csv', function(req, res) {
        services.fileServicePort.links.downloadFile.execute({
            params: {
                fileId: req.body.fileId //'57b3476991a9451b002cecef'
            }
        }, function(err, result) {
            if (!err) {
                Import.createImportCSV(req.body.description, req.body.fileId,
                    req.body.dataFor, result.response.rawEncoded,
                    function(
                        err, result) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(200).send({
                                message: 'Import tracker is created with id: ' + result.importId,
                                importId: result.importId
                            });
                        }
                    });
            }
        });
    });
    app.get(API + 'get-import-progress', function(req, res) {
        Import.getImportProgress(function(err, result) {
            if (err) {
                res.status(200).send([]);
            } else {
                res.status(200).send(result);
            }
        });
    });
    app.get(API + 'get-import-completed', function(req, res) {
        Import.getImportCompleted(function(err, result) {
            if (err) {
                res.status(200).send([]);
            } else {
                res.status(200).send(result);
            }
        });
    });
    app.get(API + 'get-import-failed', function(req, res) {
        Import.getImportFailed(function(err, result) {
            if (err) {
                res.status(200).send([]);
            } else {
                res.status(200).send(result);
            }
        });
    });
    app.get(API + 'get-import-logs/:importId', function(req, res) {
        Import.getImportLogs(req.params.importId, function(err, result) {
            if (err) {
                res.status(200).send([]);
            } else {
                res.status(200).send(result);
            }
        });
    });
    app.delete(API + 'remove-import-tracker/:importId', function(req, res) {
        Import.removeImportTracker(req.params.importId, function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({
                    message: 'Import ' + req.params.importId + ' has been removed'
                });
            }
        });
    });
};