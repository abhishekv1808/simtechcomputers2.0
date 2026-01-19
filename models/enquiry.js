const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    processor: {
        type: String,
        required: false
    },
    ram: {
        type: String,
        required: false
    },
    storage: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: false
    },
    purpose: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
