const {MessageEmbed} = require('discord.js');

const userPermission = 'User'
const color = 0x00ff00
export const tempVoiceEmbed = new MessageEmbed()
    .setColor(color)
    .setTitle('voice')
    .setDescription('Change settings for temporary voice channel')
    .addFields({name:'Command List', value:'***``/voice name <name>``*** Changes the channels name\n' +
        '***``/voice lock``*** Locks the channel\n' +
        '***``/voice unlock``*** Unlocks the channel\n' +
        '***``/voice hide``*** Hides the channel\n' +
        '***``/voice show``*** Shows the channel\n' +
        '***``/voice limit <limit>``*** Sets the limit of users in the channel (0 for unlimited)\n' +
        '***``/voice claim``*** Claims the channel, once the Owner has left\n' +
        '***``/voice transfer <user>``*** Transfers the channel Owner to the user\n' +
        '***``/voice allow <userOrRole>, <userOrRole> ...``*** Adds a user or role to join channel\n' +
        '***``/voice kick <user>, <user2> ...``*** Removes user from channel and reject user from joining\n', inline:false})
    .addFields({name:'Required Permission to execute command', value:userPermission, inline:false});

export function embed_info(user: string) {
    return new MessageEmbed()
        .setColor(color)
        .setTitle('Channel Information')
        .addFields(
            {name: 'Channel Owner ', value: '<@' + user + '>', inline: true},
            {name: 'Member Limit ', value: 'unlimited', inline: true},
            {name: 'Lock mode ', value: 'Unlocked', inline: true},
        )
        .addFields({name: '\u200b', value:'\u200b', inline:false})
        .addFields(
            {name: 'Hide mode ', value: 'Unhidden', inline: true},
            {name: 'Member Limit ', value: 'unlimited', inline: true},
            {name: 'Streaming disabled ', value: 'no', inline: true},
        )
}


//module.exports = {embeds: {voice_command: embed_command, voice_info: embed_info}}