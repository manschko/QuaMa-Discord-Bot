const {schemas} = require("../schema");

function createName(name, username) {
    return undefined;
}

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const config = await schemas.config.findOne()
        //check if channel is master channel
        if (config.temp_master_channel.filter(x => x.id == newState.channelId).length !== 0) {

            const i = config.temp_master_channel.findIndex(x => x.id == newState.channelId)
            const username = newState.member.user.username //TODO is using discord username and not server nickname
            let counter
            if (config.temp_master_channel[i].counter.length > 1) {
                //TODO check which of those is the lowest number [max, 1 , 4, 6] should take 1 not 6
                counter = config.temp_master_channel[i].counter[config.temp_master_channel[i].counter.length - 1]
                config.temp_master_channel[i].counter.pop()
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
                    newState.setChannel(newChannel, {reson: 'moving to created temp channel'})
                })
            })

        } else if (await schemas.temp_channel.count({id: oldState.channelId}) > 0) {
            const temp_channel = await schemas.temp_channel.findOne({id: oldState.channelId})
            const i = config.temp_master_channel.findIndex(x => x.id == temp_channel.master_channel_id)
            oldState.guild.channels.fetch(oldState.channelId).then(async (channel) => {
                const user_count = channel.members.size
                if (user_count === 0) {
                    channel.delete()
                    if (config.temp_master_channel[i].counter[0] === temp_channel.counter) {
                        config.temp_master_channel[i].counter[0] -= 1
                    } else {
                        config.temp_master_channel[i].counter.push(temp_channel.counter)
                    }
                    await temp_channel.remove()

                }
            })
            await config.save()
        }
    }
}
