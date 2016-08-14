'use strict';
var API = process.env.API_NAME || '/api/import/';
var Import = require('./import');
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.status(200).send(
		{
			domain : process.env.DOMAIN_NAME || 'Import',
			links : {
				createImportCSV : {
					method : 'POST',
					url : 'http://' + req.headers.host + API + 'create-import-csv'
				}
			}
		});
	});

	app.post(API + 'create-import-csv', function(req, res) {
		Import.createImportCSV(req.body.description, req.body.limit, function(
				err, result) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(200).send(
				{
					message : 'Import tracker is created with id: ' + result.importId,
					importId : result.importId
				});
			}
		});
	});

};