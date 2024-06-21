import { Client, Collection } from 'discord.js';
import path from 'path';
import fs from 'fs';

/**
 * A Discord Slash Command
 *
 * @typedef {{
 * data: SlashCommandBuilder,
 * execute: (interaction: ChatInputCommandInteraction) => Promise<void>
 * }} SlashCommand
 */

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @typedef {import('discord.js').SlashCommandBuilder} SlashCommandBuilder */

/** @typedef {import('discord.js').Client} Client */

class GatoClient extends Client {
    /**
     * Create the music client
     * @param {import("discord.js").ClientOptions} props - Client options
     */
    constructor(props, root, token, logger) {
        super(props);

        /** @type {Collection<string, SlashCommand} */
        this.commands = new Collection();
        this.vxPrefix = true;
        this.root = root;
        this.token = token;
        /** @type {import("winston").winston.Logger} */
        this.logger = logger;
        this.logger.warn;
        this.commandsRegistered = [];
        this.setCommands();
        this.setEvents();
    }

    async setCommands() {
        const foldersPath = path.join(this.root, 'commands');
        await this.registerCommandsInDirectory(foldersPath);

        this.logger.info(`Client commands registered: ${this.commandsRegistered.toString()}`);
    }

    async registerCommandsInDirectory(directoryPath) {
        const items = fs.readdirSync(directoryPath);
        for (const item of items) {
            let itemPath = path.join(directoryPath, item);
            if (
                fs.statSync(itemPath).isFile() &&
                item.endsWith('.js') &&
                !item.endsWith('.subcommand.js')
            ) {
                itemPath = `File:///${itemPath}`;
                const command = await import(itemPath);
                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    this.commandsRegistered.push(` ${item.split('.')[0]}`);
                } else {
                    this.logger.warn(
                        `The command at ${itemPath} is missing a required "data" or "execute" property.`
                    );
                }
            } else if (fs.statSync(itemPath).isDirectory()) {
                await this.registerCommandsInDirectory(itemPath); // Recursive call for subdirectories
            }
        }
    }

    async setEvents() {
        const foldersPath = path.join(this.root, 'events', 'client');
        const eventFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.js'));
        const eventsRegistered = [];
        for (const file of eventFiles) {
            const filePath = path.join('file:///', foldersPath, file);
            const event = await import(filePath);
            if ('type' in event && 'once' in event && 'execute' in event) {
                if (event.once) {
                    this.once(event.type, event.execute);
                } else {
                    this.on(event.type, event.execute);
                }
                eventsRegistered.push(` ${file.split('.')[0]}`);
            } else {
                this.logger.warn(
                    `The client event at ${filePath} is missing a required "type", "once" or "execute" property.`
                );
            }
        }
        this.logger.info(`Client events registered: ${eventsRegistered.toString()}`);
    }

    run() {
        this.login(this.token);
    }
}

export default GatoClient;
