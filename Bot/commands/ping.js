const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get a bot response'),
    async execute(interaction) {
        await interaction.reply({content: 'Pong', ephemeral: true});
    }
}