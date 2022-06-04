const {Client, Collection, Intents} = require ('discord.js')
const dotenv =  require('dotenv')
const mongoose = require('mongoose');
const {schemas} = require('./schema')
const path = require("path");
const fs = require("fs");
//permission integer 16787472
dotenv.config()


const client = new Client({
    //todo intends
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
})
client.commands = new Collection()
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}
client.once('ready', async () => {
    await mongoose.connect(process.env.DB_URI, {keepAlive: true,})
    await schemas.config.findOne().then(async (config) => {
        if (!config) {
            await new schemas.config({
                temp_master_channel: [],
            }).save()
        }
    })
    console.log('bot is running')

})


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
// client.on('interactionCreate', async (interaction) => {
//     if (!interaction.isCommand()) return;
//
//     const {commandName, options} = interaction
//     if (commandName === 'ping') {
//         await interaction.reply({
//             content: 'Pong!',
//             ephemeral: true,
//         });
//     }
//
//     else if (commandName === 'masterchannel') {
//         const channel_ids = options.getString('channel_id').replace(/\s/g, '').split(',')
//         const config = await schemas.config.findOne()
//         config.temp_master_channel.id = []
//         for(const id of channel_ids) {
//             const channel = await client.channels.fetch(id);
//             if (!channel)
//                 return await interaction.reply({
//                     content: 'channel with id ' + id + ' not found',
//                     ephemeral: true,
//                 });
//             config.temp_master_channel.push({id:channel.id, name:'vc'})
//
//             await config.save()
//         }
//         await interaction.reply({
//             content: 'Master channel set',
//             ephemeral: true,
//         });
//     }
// })
//
// client.on('voiceStateUpdate', (oldState, newState) => {
//     if (newState.channelId === '777896991359107092') //left 258933497266307073
//         console.log(newState.member?.id, ' entered channel');
// })

client.login(process.env.TOKEN)
