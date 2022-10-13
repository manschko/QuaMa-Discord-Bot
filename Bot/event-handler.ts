import getFiles from "./util/readFiles";
import {Client} from "discord.js";


export default (client: Client) => {
    const suffix = ".ts";
    const eventFiles = getFiles(suffix, "./events");
    console.log(eventFiles);


    for (const event of eventFiles) {
        const eventFile = require(event);
        if (eventFile.once) {
            client.once(eventFile.name, (...args: any[]) => eventFile.execute(...args));
        } else {
            client.on(eventFile.name, (...args: any[]) => eventFile.execute(...args));
        }
    }


}