import {Client, Collection, Intents} from 'discord.js'
import dotenv from 'dotenv'
//permission integer 16787472
dotenv.config()


//declare intents
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

//load Command files
let commandHandler = require('./command-handler')
if (commandHandler.default) commandHandler = commandHandler.default;
commandHandler(client)

//load Event files
let eventHandler = require('./event-handler')
if (eventHandler.default) eventHandler = eventHandler.default;
eventHandler(client)


client.login(process.env.TOKEN)
