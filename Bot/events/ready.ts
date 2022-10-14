import Surreal from 'surrealdb.js';
import dotenv from 'dotenv'
import {Client} from "discord.js";


export default {
    name: 'ready',
    once: true,
    async execute(client : Client) {
        dotenv.config();
        const db = Surreal.Instance;
        await db.connect(process.env.SURREALDB_URL!);
        await db.signin({
            user: process.env.SURREALDB_USER!,
            pass: process.env.SURREALDB_PASS!,
        });
        await db.use(process.env.SURREALDB_NAMESPACE!, process.env.SURREALDB_DATABASE!);
        console.log(`${client.user!.tag} is running!`)

        /*todo check existing channels
        check if channel is manuell deleted
        check if people are in masterchannel
        */
    }
}