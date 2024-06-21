import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const token = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.TOKEN_TEST;

const clientId =
    process.env.NODE_ENV === 'production' ? process.env.CLIENT_ID : process.env.CLIENT_ID_TEST;
const guildId = process.env.GUILD_ID_TEST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function registerCommandsRecursive(directoryPath, commands = []) {
    const items = fs.readdirSync(directoryPath);
    for (const item of items) {
        let itemPath = path.join(directoryPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            if (process.env.NODE_ENV === 'production' && item === 'test') {
                continue;
            }
            await registerCommandsRecursive(itemPath, commands);
        } else if (!item.endsWith('.subcommand.js')) {
            // Convert Windows absolute path to file URL
            const itemURL = new URL('file:///' + itemPath.replace(/\\/g, '/'));
            const command = await import(itemURL.href);
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

registerCommandsRecursive(path.join(__dirname, 'commands')).then(async (commands) => {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(token);
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        let data = '';
        if (process.env.NODE_ENV === 'production') {
            // The put method is used to fully refresh all commands in the guild with the current set
            data = await rest.put(Routes.applicationCommands(clientId), {
                body: commands
            });
        } else {
            data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: commands
            });
        }
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
});
