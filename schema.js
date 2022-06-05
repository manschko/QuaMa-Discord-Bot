const mongoose = require('mongoose');

const temp_channel = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    master_channel_id: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        required: true
    }
})

const config = new mongoose.Schema({
    temp_master_channel:{
        type: [{
            id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            counter: [{
                type: Number,
                required: true,
            }]
        }],
        required: false
    }
})

const schemas = {
    temp_channel: mongoose.model('temp_channel', temp_channel, 'temp_channels'),
    config: mongoose.model('config', config, 'configs'),
}

module.exports = { schemas }