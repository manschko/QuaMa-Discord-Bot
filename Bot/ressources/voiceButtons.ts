const {MessageButton, MessageActionRow} = require("discord.js");

export const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('claim_temp')
                .setEmoji('👑')
                .setLabel('Claim Temp channel')
                .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('lock_temp')
                .setEmoji('🔒')
                .setLabel('Lock/Unlock Temp channel')
                .setStyle('SECONDARY')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('hide_temp')
                .setEmoji('👁️')
                .setLabel('Hide/Unhide Temp channel')
                .setStyle('SECONDARY')
        )
