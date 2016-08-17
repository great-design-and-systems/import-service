'use strict';
var mongoose = require('mongoose');
var importColumnsScheme = new mongoose.Schema({
    importId: {
        type: String,
        required: [true, 'ImportId is required']
    },
    columns: {
        type: Array,
        required: [true, 'columns are required']
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ImportColumns', importColumnsScheme);