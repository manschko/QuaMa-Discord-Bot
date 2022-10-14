import {Client, Collection} from "discord.js";
import getFiles from "./util/readFiles";
import {ExtendedClient} from "./model/extendedClient";


export default (client: ExtendedClient) => {
    const commands = {} as { [key: string]: any };
    const suffix = ".ts";
    const commandFiles = getFiles(suffix, "./commands");
    client.commands = new Collection();


    for (const command of commandFiles) {
        let commandFile = require(command)
        if (commandFile.default) commandFile = commandFile.default;
        const commandName = command.replace(/\\/g, '/').split("/").pop()!.replace(suffix, "");
        commands[commandName.toLowerCase()] = commandFile;
    }


    client.commands = commands as Collection<String, any>;
}