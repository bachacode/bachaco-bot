const { Client, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const Logger = require('./Logger');
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
        this.logger = new Logger(root);
        this.setCommands();
        this.setEvents();
    }

    setCommands() {
        const foldersPath = path.join(this.root, 'commands');
        this.registerCommandsInDirectory(foldersPath);
    }

    registerCommandsInDirectory(directoryPath) {
        const items = fs.readdirSync(directoryPath);
        for (const item of items) {
            const itemPath = path.join(directoryPath, item);
            if (
                fs.statSync(itemPath).isFile() &&
                item.endsWith('.js') &&
                !item.endsWith('.subcommand.js')
            ) {
                const command = require(itemPath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    this.logger.info('Command Loaded: ' + item.split('.')[0]);
                } else {
                    this.logger.warn(
                        `The command at ${itemPath} is missing a required "data" or "execute" property.`
                    );
                }
            } else if (fs.statSync(itemPath).isDirectory()) {
                this.registerCommandsInDirectory(itemPath); // Recursive call for subdirectories
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
                this.logger.info('Client Event Loaded: ' + file.split('.')[0]);
            } else {
                this.logger.warn(
                    `The client event at ${filePath} is missing a required "type", "once" or "execute" property.`
                );
            }
        }
    }

    run() {
        this.login(this.token);
    }
}

module.exports = GatoClient;
