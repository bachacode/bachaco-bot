import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const token = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.TOKEN_TEST;
const clientId =
    process.env.NODE_ENV === 'production' ? process.env.CLIENT_ID : process.env.CLIENT_ID_TEST;
const guildId = process.env.GUILD_ID_TEST;

const rest = new REST().setToken(token);

if (process.env.NODE_ENV === 'production') {
    (async () => {
        rest.put(Routes.applicationCommands(clientId), { body: [] })
            .then(() => console.log('Successfully deleted all production guild commands.'))
            .catch(console.error);
    })();
} else {
    (async () => {
        rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
            .then(() => console.log('Successfully deleted all development guild commands.'))
            .catch(console.error);
    })();
}
