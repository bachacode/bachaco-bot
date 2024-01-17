require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

let token, clientId;

if (process.env.NODE_ENV === 'production') {
    token = process.env.TOKEN;
    clientId = process.env.CLIENT_ID;
} else {
    token = process.env.TOKEN_TEST;
    clientId = process.env.CLIENT_ID_TEST;
}

const guildId = process.env.GUILD_ID;

function registerCommandsRecursive(directoryPath, commands = []) {
    const items = fs.readdirSync(directoryPath);

    for (const item of items) {
        const itemPath = path.join(directoryPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            if (process.env.NODE_ENV === 'production' && item === 'test') {
                continue;
            }
            registerCommandsRecursive(itemPath, commands);
        } else if (item.endsWith('.js')) {
            const command = require(itemPath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(
                    `[WARNING] The command at ${itemPath} is missing a required "data" or "execute" property.`
                );
            }
        }
    }

    return commands;
}

// Utiliza la función registerCommandsRecursive
const commands = registerCommandsRecursive(path.join(__dirname, 'commands'));

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands
        });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
