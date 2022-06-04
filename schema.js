const mongoose = require('mongoose');

const voice_channel_id = new mongoose.Schema({
    id: {
        type: String,
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
            }
        }],
        required: false
    }
})

const schemas = {
    voice_channel_id: mongoose.model('voice_channel_id', voice_channel_id, 'voice_channel_ids'),
    config: mongoose.model('config', config, 'configs'),
}

module.exports = { schemas }