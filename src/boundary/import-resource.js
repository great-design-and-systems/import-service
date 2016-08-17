'use strict';
var API = process.env.API_NAME || '/api/import/';
var Import = require('./import');
var parse = require('csv-parse');
module.exports = function(app, services) {

    app.get('/', function(req, res) {
        res.status(200).send({
            domain: process.env.DOMAIN_NAME || 'Import',
            links: {
                createImportCSV: {
                    method: 'POST',
                    url: 'http://' + req.headers.host + API + 'create-import-csv'
                }
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
                parse(result.response.rawEncoded, { comment: '#' }, function(err0, data) {
                    if (data) {
                        var limit = data.length;
                        Import.createImportCSV(req.body.description, limit, req.body.dataFor, function(
                            err, result) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                Import.createImportCSVColumns(result.importId, data[0], function(err) {
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
                    }
                });
            }
        });

    });
};