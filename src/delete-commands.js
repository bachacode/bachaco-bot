require('dotenv').config();
const { REST, Routes } = require('discord.js');

let token, clientId;

if (process.env.NODE_ENV === 'production') {
    token = process.env.TOKEN;
    clientId = process.env.CLIENT_ID;
} else {
    token = process.env.TOKEN_TEST;
    clientId = process.env.CLIENT_ID_TEST;
}

const guildId = process.env.GUILD_ID;

const rest = new REST().setToken(token);

(async () => {
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
        .then(() => console.log('Successfully deleted all guild commands.'))
        .catch(console.error);
})();
