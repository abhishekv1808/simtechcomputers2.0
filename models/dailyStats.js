const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dailyStatsSchema = new Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        unique: true
    },
    views: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('DailyStats', dailyStatsSchema);
