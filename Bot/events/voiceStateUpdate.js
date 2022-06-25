const {schemas} = require("../schmas/DBschema");
const {embeds} = require("../ressources/embed");
const {buttons} = require("../ressources/voiceButtons");



module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const config = await schemas.config.findOne()
        //check if channel is master channel
        if (await schemas.temp_channel.count({id: oldState.channelId}) > 0) {
            await tempChannelDelete(config, oldState)
        }
        if (config.temp_master_channel.filter(x => x.id == newState.channelId).length !== 0) {

            await tempChannelCreate(config, newState)

        }
    }
}


async function tempChannelDelete(config, oldState) {
    const temp_channel = await schemas.temp_channel.findOne({id: oldState.channelId})
    const i = config.temp_master_channel.findIndex(x => x.id == temp_channel.master_channel_id)
    oldState.guild.channels.fetch(oldState.channelId).then(async (channel) => {
        const user_count = channel.members.size
        if (user_count === 0) {
            channel.delete()
            if (config.temp_master_channel[i].counter[0] === temp_channel.counter) {
                config.temp_master_channel[i].counter[0] -= 1

                while (config.temp_master_channel[i].counter.filter(x => x === config.temp_master_channel[i].counter[0]).length > 1){
                    const n = config.temp_master_channel[i].counter[0]
                    config.temp_master_channel[i].counter[0] -= 1
                    config.temp_master_channel[i].counter.splice(config.temp_master_channel[i].counter.indexOf(n), 1)
                }

            } else {
                config.temp_master_channel[i].counter.push(temp_channel.counter)
            }
            await temp_channel.remove()

        }
    })
    await config.save()
}
async function tempChannelCreate(config, newState) {
    const i = config.temp_master_channel.findIndex(x => x.id == newState.channelId)
    const username = newState.member.nickname === null ? newState.member.user.username : newState.member.nickname
    let counter
    if (config.temp_master_channel[i].counter.length > 1) {
        const i = config.temp_master_channel[i].counter.indexOf(Math.min(...config.temp_master_channel[i].counter))
        counter = config.temp_master_channel[i].counter.splice(i,1)[0]
    } else {
        counter = config.temp_master_channel[i].counter[0] += 1
    }
    await config.save()
    const channel_name = eval('`' + config.temp_master_channel[i].name + '`')
    newState.guild.channels.fetch(newState.channelId).then(async (channel) => {
        channel.clone({name: channel_name}).then(async (newChannel) => {
            await new schemas.temp_channel({
                id: newChannel.id,
                master_channel_id: newState.channelId,
                owner: newState.id,
                counter: counter
            }).save()
            newChannel.send({embeds: [embeds.voice_command, embeds.voice_info(newState.id)], components: [buttons]})
            newState.setChannel(newChannel, {reson: 'moving to created temp channel'})
        })
    })
}

