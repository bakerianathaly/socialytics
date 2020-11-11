const mongoose = require('mongoose')
const instagramModel = require('../models/instagram')
const Schema = mongoose.Schema

const instagramMediaSchema = new Schema({
    dateInsert: {
        type: date,
        default: Date.now,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    followers: {
        type: Number,
        required: true
    },
    following: {
        type: Number,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    media: {
        type: [],
        required: true
    },
    instagramId: {
        type: Schema.ObjectId,
        ref: instagramModel,
        required: true
    }
});

var instagramMedia = mongoose.model('instagramMedia', instagramMediaSchema);
module.exports = instagramMedia;