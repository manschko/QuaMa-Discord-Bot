const mongoose = require('mongoose');
const {schemas} = require('../schmas/DBschema')

module.exports = {
    name: 'ready',
    async execute() {
        await mongoose.connect(process.env.DB_URI, {keepAlive: true,})
        await schemas.config.findOne().then(async (config) => {
            if (!config) {
                await new schemas.config({
                    temp_master_channel: [],
                }).save()
            }
        })
        console.log('bot is running')
    }
}