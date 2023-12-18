const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @typedef {import('discord.js').SlashCommandBuilder} SlashCommandBuilder */

/** @typedef {import('discord.js').Client} Client */

class GatoClient extends Client {
    /**
     * Create the music client
     * @param {import("discord.js").ClientOptions} props - Client options
     */
    constructor(props, root, token) {
        super(props);

        /** @type {Collection<string, import('../types').SlashCommand} */
        this.commands = new Collection();
        this.vxPrefix = true;
        this.root = root;
        this.token = token;
        this.setCommands();
        this.setEvents();
        this.run();
    }

    setCommands() {
        const foldersPath = path.join(this.root, 'commands');
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory you created earlier
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs
                .readdirSync(commandsPath)
                .filter((file) => file.endsWith('.js'));
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    console.log('Command Loaded: ' + file.split('.')[0]);
                } else {
                    console.log(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                    );
                }
            }
        }
    }

    setEvents() {
        const foldersPath = path.join(this.root, 'events', 'client');
        const eventFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(foldersPath, file);
            const event = require(filePath);
            if ('type' in event && 'once' in event && 'execute' in event) {
                if (event.once) {
                    this.once(event.type, event.execute);
                } else {
                    this.on(event.type, event.execute);
                }
                console.log('Client Event Loaded: ' + file.split('.')[0]);
            } else {
                console.log(
                    `[WARNING] The event at ${filePath} is missing a required "type", "once" or "execute" property.`
                );
            }
        }
    }

    run() {
        this.login(this.token);
    }
}

module.exports = GatoClient;
