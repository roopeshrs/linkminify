const mongoose = require('mongoose');

const guesturlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 180
    }
}, {timestamps: true})

module.exports = mongoose.model("Guesturl", guesturlSchema);