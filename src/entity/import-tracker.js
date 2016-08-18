'use strict';
var mongoose = require('mongoose');
var importTrackerSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: String,
        default: 'NEW',
        enum: ['NEW', 'INPROGRESS', 'FAILED', 'COMPLETED']
    },
    progressCount: {
        type: Number,
        default: 0
    },
    errorCount: {
        type: Number,
        default: 0
    },
    progressLimit: {
        type: Number,
        required: [true, 'Progress limit is required.']
    },
    updatedOn: Date,
    type: {
        type: String,
        required: [true, 'Type is required.']
    },
    dataFor: {
        type: String,
        required: [true, 'Data for is required']
    },
    fileId: {
        type: String,
        required: [true, 'File id is required']
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ImportTracker', importTrackerSchema);