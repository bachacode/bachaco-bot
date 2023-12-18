const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @typedef {import('discord.js').SlashCommandBuilder} SlashCommandBuilder */

/** @typedef {import('discord.js').Client} Client */

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const getCommands = () => {
    /**
     * An array of commands.
     *
     * @type {import('./types').SlashCommand[]} interaction The interaction object.
     */
    const commands = [];
    for (const folder of commandFolders) {
        // Grab all the command files from the commands directory you created earlier
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command);
            } else {
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
            }
        }
    }
    return commands;
};

// and deploy your commands!
const registerCommands = async () => {
    const commands = getCommands();
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
};

/**
 *
 * @param {Client} client
 */
const setCommands = (client) => {
    const commands = getCommands();
    for (const command of commands) {
        try {
            client.commands.set(command.data.name, command);
        } catch (error) {
            console.log(`${command.data} \n: ${error}`);
        }
    }
};

module.exports.setCommands = setCommands;

module.exports.registerCommands = registerCommands;
