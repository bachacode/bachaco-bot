import 'dotenv/config';
import clientOptions from './config/clientOptions.js';
import GatoClient from './classes/GatoClient.js';
import GatoPlayer from './classes/GatoPlayer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const token = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.TOKEN_TEST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create a new client instance
const client = new GatoClient(clientOptions, __dirname, token);

// Create a new player instance
const player = new GatoPlayer(client, {}, __dirname);

if (process.env.NODE_ENV !== 'production') {
    player.on('debug', (message) => console.log(`[Player] ${message}`));
    player.events.on('debug', (queue, message) =>
        console.log(`[${queue.guild.name}: ${queue.guild.id}] ${message}`)
    );
    player.events.on('playerError', (queue, error) =>
        console.log(`[${queue.guild.name}: ${queue.guild.id}] ${error}`)
    );
    player.events.on('error', (queue, error) =>
        console.log(`[${queue.guild.name}: ${queue.guild.id}] ${error}`)
    );
}

client.run();

// prevent crash on unhandled promise rejection
process.on('unhandledRejection', (reason) => {
    console.log(reason);
    client.logger.error('Unhandled promise rejection:', reason);
});

// prevent crash on uncaught exception
process.on('uncaughtException', (error) => {
    client.logger.error('Uncaught exception:', error);
});
