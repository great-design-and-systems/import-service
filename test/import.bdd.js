(function () {
  'use strict';
  var Import = require('../src/boundary/import');
  var Database = require('./config/database');
  var sinon = require('sinon');
  var chai = require('chai');
  var expect = chai.expect;
  var fs = require('fs-extra');
  describe('Import Service BDD', function () {
    var db = new Database();

    beforeEach(function (done) {
      return db.connect(done);
    });

    describe('GIVEN: I have import tracker info', function () {

      var importTracker = {};

      beforeEach(function () {
        importTracker.description = 'Smple tracker 1';
        importTracker.progressLimit = 2;
      });

      describe('WHEN: creating new import csv', function () {
        var createdImportId;
        beforeEach(function (done) {
          Import.createImportCSV(importTracker.description, importTracker.progressLimit, function (err, result) {
            if (err) {
              console.error('Creating new import', err);
            }
            createdImportId = result.importId;
            done();
          });
        });
        it('THEN: import tracker is created', function () {
          expect(createdImportId).to.not.be.null;
        });
      });
    });

    afterEach(function (done) {
    	return db.disconnect(done);
    });
  });
})();