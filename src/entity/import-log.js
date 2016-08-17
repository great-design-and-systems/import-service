'use strict';
var mongoose = require('mongoose');
var importLogSchema = new mongoose.Schema({
    importId: {
        type: String,
        required: [true, 'Import Id is required']
    },
    items: {
        type: Array,
        required: [true, 'Item values are required']
    },
    columns: {
        type: Array,
        required: [true, 'Column values are required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: String,
        default: 'NEW',
        enum: ['FAILED', 'SUCCESS']
    },
    progressCount: {
        type: Number,
        default: 0
    },
    updatedOn: Date,
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ImportLog', importLogSchema);