'use strict';
var marc4js = require('marc4js');
var lodash = require('lodash');
var logger = require('./get-logger');

function getData(subfields) {
    var data = lodash.map(subfields, 'data');
    return lodash.join(data, ' ');
}
function execute(marcRecord, callback) {
    var jsonFormat = {};

    marc4js.transform(marcRecord, { format: 'text' }, function (err, data) {
        if (err) {
            logger.error('create-json-from-marc-record', err);
            callback(err);
        } else {
            jsonFormat.marc = data;
            marcRecord.dataFields.forEach(function (dataField) {
                if (dataField.tag === '050') {
                    jsonFormat.callNumber = getData(dataField.subfields);
                } else if (dataField.tag === '100') {
                    jsonFormat.author = getData(dataField.subfields);
                } else if (dataField.tag === '245') {
                    jsonFormat.title = getData(dataField.subfields);
                } else if (dataField.tag === '250') {
                    jsonFormat.edition = getData(dataField.subfields);
                } else if (dataField.tag === '260') {
                    jsonFormat.published = getData(dataField.subfields);
                } else if (dataField.tag === '300') {
                    jsonFormat.description = getData(dataField.subfields);
                } else if (dataField.tag === '500') {
                    jsonFormat.notes = getData(dataField.subfields);
                } else if (dataField.tag === '505') {
                    jsonFormat.contents = getData(dataField.subfields);
                } else if (dataField.tag === '650') {
                    jsonFormat.subject = getData(dataField.subfields);
                }
            });
            callback(undefined, jsonFormat);
        }
    });


}

module.exports = execute;