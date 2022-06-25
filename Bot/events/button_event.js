const {schemas} = require("../schmas/DBschema");

const {Permissions} = require('discord.js');
const {unlock, lock, hide, show,claim} = require("../commands/voice");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const channelId = interaction.member.voice.channelId

        if (await schemas.temp_channel.count({id: channelId}) <= 0)
            return;
        //TODO what if not in a channel

        const config = await schemas.config.findOne()
        switch (interaction.customId) {
            case 'claim_temp':
                claim(interaction)
                break;
            case 'lock_temp':
                toggle_lock(interaction)
                break;
            case 'hide_temp':
                toggle_hide(interaction)
                break;
        }
    }
}

function toggle_lock(interaction) {
    if (interaction.channel.permissionsFor(interaction.guild.roles.everyone).has(Permissions.FLAGS.CONNECT)) {
        lock(interaction)
        return;
    }
    unlock(interaction)
}

function toggle_hide(interaction) {
    if (interaction.channel.permissionsFor(interaction.guild.roles.everyone).has(Permissions.FLAGS.VIEW_CHANNEL)) {
        hide(interaction)
        return;
    }
    show(interaction)
}
