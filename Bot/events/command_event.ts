import {Interaction} from "discord.js";
import {ExtendedClient} from "../model/extendedClient";

export default {
    name: 'interactionCreate',
    async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        const client = interaction.client as ExtendedClient

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
}
