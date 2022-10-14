import getFiles from "./util/readFiles";
import {Client} from "discord.js";



export default (client: Client) => {
    const suffix = ".ts";
    const eventFiles = getFiles(suffix, "./events");

    for (const event of eventFiles) {
        const eventFile = require(event);
        if (eventFile.once) {
            client.once(eventFile.default.name, (...args: any[]) => eventFile.default.execute(...args));
        } else {
            client.on(eventFile.default.name, (...args: any[]) => eventFile.default.execute(...args));
        }
    }


}