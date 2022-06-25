const {SlashCommandBuilder} = require("@discordjs/builders");
const {schemas} = require("../schmas/DBschema");
const {sanitize_name} = require("../ressources/util");


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
            .addNumberOption(option => option
                .setName('number limit')
                .setDescription('number of users allowed in channel')
                .setRequired(true))
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
        const channelId = interaction.member.voice.channelId

        if (await schemas.temp_channel.count({id: channelId}) <= 0){
            interaction.reply({content:'you are currently not in a temp channel', ephemeral:true})
            return;
        }


        if (interaction.options.getSubcommand() === 'claim') {
            claim(interaction)
            return;
        }

        if ((await schemas.temp_channel.findOne({id: channelId})).owner !== interaction.user.id){
            interaction.reply({content: 'you are not the channel owner', ephemeral:true})
            return;
        }


        switch (interaction.options.getSubcommand()) {
            case 'name':
                rename(interaction)
                break;
            case 'lock':
                lock(interaction)
                break;
            case 'unlock':
                unlock(interaction)
                break;
            case 'hide':
                hide(interaction)
                break;
            case 'show':
                show(interaction)
                break;
            case 'limit':
                limit(interaction)
                break;
            case 'transfer':
                transfer(interaction)
                break;
            case 'allow':
                allow(interaction)
                break;
            case 'kick':
                kick(interaction)
                break;
        }
    },
    lock, unlock, hide, show, claim
}

function lock(interaction) {
    interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {CONNECT: false}).then(() => {
        interaction.reply({
            content: '<#' + interaction.member.voice.channelId + '>' + ' has been locked 🔒',
            ephemeral: true,
        })
    })

}

function unlock(interaction) {
    interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {CONNECT: null}).then(() => {
        interaction.reply({
            content: '<#' + interaction.member.voice.channelId + '>' + ' has been unlocked 🔓',
            ephemeral: true,
        })
    })
}

function hide(interaction) {
    interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {VIEW_CHANNEL: false}).then(() => {
        interaction.reply({
            content: '<#' + interaction.member.voice.channelId + '>' + ' is now hidden',
            ephemeral: true,
        })
    })
}

function show(interaction) {
    interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {VIEW_CHANNEL: null}).then(() => {
        interaction.reply({
            content: '<#' + interaction.member.voice.channelId + '>' + ' is now visible',
            ephemeral: true,
        })
    })
}

function rename(interaction) {
    const {options} = interaction
    const name = sanitize_name(options.getString('name'))
    interaction.member.voice.channel.setName(name)
}

function limit(interaction) {
    const {options} = interaction
    const limit = options.getNumber('number limit')
    interaction.member.voice.channel.setUserLimit(limit)
}

async function claim(interaction) {
    //todo update displayed message
    const channelId = interaction.member.voice.channelId
    const channel = await schemas.temp_channel.findOne({id: channelId})
    if (interaction.member.voice.channel.members.some(x => x.id === channel.owner)) {
        interaction.reply({content: 'Owner is still in channel', ephemeral: true})
        return;
    }

    channel.owner = interaction.user.id
    await channel.save()
    interaction.reply({content: 'You are now owner of this channel', ephemeral: true})
}

