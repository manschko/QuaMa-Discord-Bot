const { SlashCommandBuilder } = require('@discordjs/builders');
const {schemas} = require("../schema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempvoice')
        .setDescription('Setting for temporary voice channels')
        .addSubcommand(subcommand => subcommand
            .setName('masterchannel')
            .setDescription('Sets the master temp channels for the server')
            .addStringOption(option => option
                .setName('channel_ids')
                .setDescription('The channel ids of the channel to be set as master seperated by a comma')
                .setRequired(true)
            )
        ).addSubcommand(subcommand => subcommand
            .setName('name')
            .setDescription('sets the name preset of created channel')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name template for the created temp channel')
                .setRequired(true)
            ).addChannelOption(option => option
                .setName('channel_id')
                .setDescription('The channel id of the Master channel for the name preset')
                .setRequired(false)
            )
        ).addSubcommand(subcommand => subcommand
            .setName('textchannel')//TODO: will be deprecated
            .setDescription('sets if text channel should be created for temp channel')
            .addBooleanOption(option => option
                .setName('create')
                .setDescription('if text channel should be created')
                .setRequired(true)
            ).addChannelOption(option => option
                .setName('channel_id')
                .setDescription('The channel id of the Master channel for the text channel preset')
                .setRequired(false)
            )
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'masterchannel':
                await masterChannel(interaction)
                break;
            case 'name':
                await presetName(interaction);
                break;
            case 'textchannel':
                await this.textchannel(interaction);
                break;
            default:
                await interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
        }
    }
}

async function masterChannel(interaction) {
    const {commandName, options} = interaction
    const channel_ids = options.getString('channel_ids').replace(/\s/g, '').split(',')
    const config = await schemas.config.findOne()
    config.temp_master_channel = []
    for(const id of channel_ids) {
        try {
            await interaction.client.channels.fetch(id);
        } catch (e) {
            return await interaction.reply({
                content: 'channel with id ' + id + ' not found',
                ephemeral: true,
            });
        }
        config.temp_master_channel.push({id:id, name:'vc'})
    }
    await config.save()
    await interaction.reply({
        content: 'Master channel set',
        ephemeral: true,
    });
}

async function presetName(interaction){
    const {commandName, options} = interaction
    const name = options.getString('name')
    const channel_id = options.getChannel('channel_id').id
    let data =  [{}]
    if(channel_id) {
        data.push(await schemas.config.findOne({temp_master_channel: {$elemMatch: {id: channel_id}}},(err, config) => {
            if (err) {
                console.log("yaii")
            }
        }))
    }
    else {
        data = await schemas.config.findOne()
    }
    if(data) {
        return await interaction.reply({
            content: 'No Master channel found',
            ephemeral: true,
        });
    }
    data.temp_master_channel.forEach((element, index) => {
        data.temp_master_channel[index].name = name
    })

    await data.save()
    await interaction.reply({
        content: 'Name preset set',
        ephemeral: true,
    });
}
