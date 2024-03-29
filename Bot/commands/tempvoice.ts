// import {SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder} from "@discordjs/builders";
// import {Interaction, InteractionCollector} from "discord.js";
//
// const {SlashCommandBuilder} = require('@discordjs/builders');
// const {schemas} = require("../schmas/DBschema");
// const {sanitize_name} = require("../ressources/util");
//
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('tempvoice')
//         .setDescription('Setting for temporary voice channels')
//         .addSubcommand((subcommand: SlashCommandSubcommandBuilder)  => subcommand
//             .setName('masterchannel')
//             .setDescription('Sets the master temp channels for the server')
//             .addStringOption(option => option
//                 .setName('channel_ids')
//                 .setDescription('The channel ids of the channel to be set as master seperated by a comma')
//                 .setRequired(true)
//             )
//         ).addSubcommand((subcommand: SlashCommandSubcommandBuilder) => subcommand
//             .setName('name')
//             .setDescription('sets the name preset of created channel')
//             .addStringOption(option => option
//                 .setName('name')
//                 .setDescription('The name template for the created temp channel')
//                 .setRequired(true)
//             ).addChannelOption(option => option
//                 .setName('channel_id')
//                 .setDescription('The channel id of the Master channel for the name preset')
//                 .setRequired(false)
//             )
//         ),
//     async execute(interaction: any) {
//         switch (interaction.options.getSubcommand()) {
//             case 'masterchannel':
//                 await masterChannel(interaction)
//                 break;
//             case 'name':
//                 await presetName(interaction);
//                 break;
//             case 'textchannel':
//                 await this.textchannel(interaction);
//                 break;
//             default:
//                 await interaction.reply({content: 'Unknown subcommand', ephemeral: true});
//         }
//     },
//     sanitize_name
// }
//
// async function masterChannel(interaction: any) {
//     const {options} = interaction // options
//     const channel_ids = [...new Set(options.getString('channel_ids').replace(/\s/g, '').split(','))]
//     const config = await schemas.config.findOne()
//     config.temp_master_channel = []
//     if (channel_ids.length > 5) {
//         return interaction.reply({
//             content: 'Too many channels',
//             ephemeral: true,
//         });
//     }
//     for (const id of channel_ids) {
//         try {
//             await interaction.client.channels.fetch(id);
//         } catch (e) {
//             return interaction.reply({
//                 content: 'channel with id ' + id + ' not found',
//                 ephemeral: true,
//             });
//         }
//         config.temp_master_channel.push({id: id, name: `vc`, counter: [0]})
//     }
//     await config.save()
//     await interaction.reply({
//         content: 'Master channel set',
//         ephemeral: true,
//     });
// }
//
//
// async function presetName(interaction: any) {
//     const {options} = interaction
//     const name = sanitize_name(options.getString('name'))
//     const channel_id = options.getChannel('channel_id')
//     const config = await schemas.config.findOne()
//     if (config.temp_master_channel.length === 0) {
//         return interaction.reply({
//             content: 'No Master channel found',
//             ephemeral: true,
//         });
//     }
//     if (channel_id) {
//         if (config.temp_master_channel.filter((channel:any) => channel.id === channel_id.id).length === 0) {
//             return interaction.reply({
//                 content: 'No Master channel found',
//                 ephemeral: true,
//             });
//         }
//         const i = config.temp_master_channel.findIndex((x:any) => x.id === channel_id.id)
//         config.temp_master_channel[i].name = name
//     } else {
//         config.temp_master_channel.forEach((i:any) => {
//             config.temp_master_channel[i].name = name
//         })
//     }
//     await config.save()
//     await interaction.reply({
//         content: 'Name preset set',
//         ephemeral: true,
//     });
// }
