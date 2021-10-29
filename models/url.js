const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    expireAt: {
        type: Date,
        expires: 0
    }
}, {timestamps: true})

module.exports = mongoose.model("Url", urlSchema);