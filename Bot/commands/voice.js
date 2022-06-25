const {SlashCommandBuilder} = require("@discordjs/builders");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription('Controls for temp voice channels')
        .addSubcommand(subcommand => subcommand
            .setName('name')
            .setDescription('change the name of the temp voice channel')
            .addStringOption(option => option
                .setName('name')
                .setDescription('name for the voice channel')
                .setRequired(true)
            )
        ).addSubcommand(subcommand => subcommand
            .setName('lock')
            .setDescription('lock the channel for other users')
        ).addSubcommand(subcommand => subcommand
            .setName('unlock')
            .setDescription('unlock the channel for other users')
        ).addSubcommand(subcommand => subcommand
            .setName('hide')
            .setDescription('hide the channel for other users')
        ).addSubcommand(subcommand => subcommand
            .setName('show')
            .setDescription('make the channel visible for other users')
        ).addSubcommand(subcommand => subcommand
            .setName('limit')
            .setDescription('limit the allowed channel users')
        ).addSubcommand(subcommand => subcommand
            .setName('claim')
            .setDescription('claim the channel as owner')
        ).addSubcommand(subcommand => subcommand
            .setName('transfer')
            .setDescription('transfer channel owner')
            .addUserOption(option => option
                .setName('user')
                .setDescription('user you want to transfer owner to')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'name':
                break;
            case 'lock':
                break;
            case 'unlock':
                break;
            case 'hide':
                break;
            case 'show':
                break;
            case 'limit':
                break;
            case 'claim':
                break;
            case 'transfer':
                break;
            case 'allow':
                break;
            case 'kick':
                break;
        }
    }
}

function lock(interaction){
//interaction.user.id
}