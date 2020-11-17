const mongoose = require('mongoose')
const Schema = mongoose.Schema

const instagramSchema = new Schema({
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
        required: true,
        unique: true
    }
});

var Instagram = mongoose.model('Instagram', instagramSchema);
module.exports = Instagram;