const mongoose = require('mongoose')
const userModel = require('../models/user')
const Schema = mongoose.Schema

const instagramSchema = new Schema({
    username: {
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