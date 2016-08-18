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

};