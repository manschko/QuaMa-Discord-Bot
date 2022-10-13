import {Client, Collection} from "discord.js";

export type ExtendedClient = Client & { commands: Collection<String, any> }