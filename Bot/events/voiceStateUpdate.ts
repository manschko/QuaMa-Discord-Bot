import {Channel, GuildBasedChannel, GuildChannel, ThreadChannel, VoiceChannel, VoiceState} from "discord.js";
import Surreal from "surrealdb.js";
import {Data, MasterChannel, TempChannel} from "../model/data";
import {embed_info, tempVoiceEmbed} from "../ressources/embed";
import {buttons} from "../ressources/voiceButtons";
const db = Surreal.Instance



export default {
    name: 'voiceStateUpdate',
    async execute(oldState: VoiceState, newState: VoiceState) {
        //check if there is a record in the database for the guild
        let data: Data;
        try {
            data = <Data>(await db.select(`guild:${newState.guild.id}`))[0]
        } catch (e) {
            console.log(`guild:${newState.guild.id} record does not exist`)
            return
        }
        let master_channel = data.config.temp_voice.master_channels.find((channel: MasterChannel) => channel.channel_id === newState.channelId) as MasterChannel
        //user entered a master channel
        if (master_channel) {
            tempChannelCreate(data, newState, master_channel)
        } else if (data.temp_channels.filter((channel: TempChannel) => channel.channel_id === oldState.channelId).length > 0) {
            //user left temp channel
            tempChannelDelete(data, oldState)
        }
    }
}


function tempChannelDelete(data: Data, oldState: VoiceState) {
    oldState.guild.channels.fetch(oldState.channelId!).then(async (channel) => {
        //check if tempChannel is empty
        if ((channel! as VoiceChannel).members.size === 0) {

            //delete channel
            channel!.delete("Delete empty temp channel").then(async () => {
                const tempChannel = data.temp_channels.splice(data.temp_channels.findIndex((tempChannel: TempChannel) => tempChannel.channel_id === oldState.channelId), 1)

                await db.change(`guild:${oldState.guild.id}`, {temp_channels: data.temp_channels})
            })
        }
    })
}


function tempChannelCreate(data: Data, newState: VoiceState, master_channel: MasterChannel) {
    const username = newState.member?.nickname === null ? newState.member?.user.username : newState.member?.nickname
    let numbers = master_channel.counter

    //determine next available counter number
    let counter = numbers.length + 1;
    for (let i = 1; i <= numbers.length; i++) {
        if (numbers[i - 1] !== i) {
            counter = i
            numbers.splice(i - 1, 0, i)
            break;
        }
    }
    if(counter === numbers.length + 1){
        numbers.push(counter)
    }

    //generate channel name
    const channel_name = eval('`' + master_channel.name + '`')

    newState.guild.channels.fetch(newState.channelId!).then(async (channel) => {
        (channel! as VoiceChannel).clone({name: channel_name}).then(async (newChannel) => {
            const test = new TempChannel(newChannel.id, newState.id, counter, master_channel.channel_id)
            data.temp_channels.push(new TempChannel(newChannel.id, newState.id, counter, master_channel.channel_id))
            newChannel.send({embeds: [tempVoiceEmbed, embed_info(newState.id)], components: [buttons]})
            await newState.setChannel(newChannel,  'moving to created temp channel').then(() => {
                db.change(`guild:${newState.guild.id}`, {config: data.config, temp_channels: data.temp_channels})
            })
        })
    })

}