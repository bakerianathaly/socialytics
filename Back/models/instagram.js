const mongoose = require('mongoose')
const userModel = require('../models/user')
const Schema = mongoose.Schema

const instagramSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    followers_count: {
        type: Number,
        required: true
    },
    follows_count: {
        type: Number,
        required: true
    },
    media_count: {
        type: Number,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    facebookId:{
        type: String,
        required: true
    },
    instagramId:{
        type: String,
        required: true
    },
    socialyticId: {
        type: String,
        required: true
    }
});

var Instagram = mongoose.model('Instagram', instagramSchema);
module.exports = Instagram;