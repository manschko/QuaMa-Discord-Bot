import DiscordJS, {Intents} from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
//permission integer 16787472
dotenv.config()

import schemas from './schema'

const client = new DiscordJS.Client({
    //todo intends
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
})

client.on('ready', async () => {
    await mongoose.connect(process.env.DB_URI!, {keepAlive: true,})
    console.log('bot is running')
    const guild = client.guilds.cache.get(process.env.GUILD_ID!)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: 'Replies with Pong'
    })
    commands?.create({
        name: 'masterchannel',
        description: 'Sets the master temp channels for the server',
        options: [
            {
                name: 'channel_id',
                description: 'The channel ids of the channel to be set as master seperated by a comma',
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            },
    ]})
    await schemas.config.findOne().then(async (config) => {
        if (!config) {
            await new schemas.config({
                temp_master_channel: [],
            }).save()
        }
    })

})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const {commandName, options} = interaction
    if (commandName === 'ping') {
        await interaction.reply({
            content: 'Pong!',
            ephemeral: true,
        });
    }

    else if (commandName === 'masterchannel') {
        const channel_ids = options.getString('channel_id')!.replace(/\s/g, '').split(',')
        const config = await schemas.config.findOne()
        config.temp_master_channel.id = []
        for(const id of channel_ids) {
            const channel = await client.channels.fetch(id);
            if (!channel)
                return await interaction.reply({
                    content: 'channel with id ' + id + ' not found',
                    ephemeral: true,
                });
            config.temp_master_channel.push({id:channel.id, name:'vc'})

            await config.save()
        }
        await interaction.reply({
            content: 'Master channel set',
            ephemeral: true,
        });
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.channelId === '777896991359107092') //left 258933497266307073
        console.log(newState.member?.id, ' entered channel');
})

client.login(process.env.TOKEN)
