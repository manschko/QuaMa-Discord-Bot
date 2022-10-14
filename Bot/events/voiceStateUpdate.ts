import {VoiceState} from "discord.js";
import Surreal from "surrealdb.js";
import {Data, MasterChannel} from "../model/data";
const db = Surreal.Instance



export default {
    name: 'voiceStateUpdate',
    async execute(oldState: VoiceState, newState: VoiceState) {
        let data:Data;
        try{
            data = <Data>(await db.select(`guild:${newState.guild.id}`))[0]
        }catch (e) {
            console.log(`guild:${newState.guild.id} record does not exist`)
            return
        }
        let master_channel = data.config.temp_voice.master_channels.find((channel:MasterChannel) => channel.channel_id === newState.channelId) as MasterChannel
        //user entered a master channel
        if (master_channel){
            tempChannelCreate(data, newState, master_channel)
        }
    }
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

    const channel_name = eval('`' + master_channel.name + '`')

    //maybe later when all is done
    db.change(`guild:${newState.guild.id}`, {config: data.config})

}