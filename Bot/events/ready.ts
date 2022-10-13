import Surreal from 'surrealdb.js';
import dotenv from 'dotenv'
dotenv.config();

console.log(process.env.SURREALDB_URL);
const db = new Surreal(process.env.SURREALDB_URL);
//const db = new Surreal(process.env.SURREALDB_URL);

export default {
    name: 'ready',
    async execute() {
        await Surreal.Instance.connect(process.env.SURREALDB_URL!);
        // Signin as a namespace, database, or root user
        await db.signin({
            user: process.env.SUREALDB_USER!,
            pass: process.env.SUREALDB_PASS!,
        });

        await db.use(process.env.SURREALDB_NAMESPACE!, process.env.SURREALDB_DATABASE!);

        /*await schemas.config.findOne().then(async (config) => {
            if (!config) {
                await new schemas.config({
                    temp_master_channel: [],
                }).save()
            }
        })*/
        console.log('bot is running')
        /*todo check existing channels
        check if channel is manuell deleted
        */
    }
}