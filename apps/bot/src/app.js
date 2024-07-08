import 'dotenv/config';
import clientOptions from './config/clientOptions.js';
import GatoClient from './classes/GatoClient.js';
import GatoPlayer from './classes/GatoPlayer.js';
import getLogger from '@repo/logger';
import path from 'path';
import { fileURLToPath } from 'url';

const token = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.TOKEN_TEST;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new logger instance
const logger = getLogger(path.join(__dirname, '..', 'logs'));
// Create a new client instance
const client = new GatoClient(clientOptions, __dirname, token, logger);
// Create a new player instance
const player = new GatoPlayer(
    client,
    {
        skipFFmpeg: true
    },
    __dirname
);

if (process.env.NODE_ENV !== 'production') {
    player.on('debug', (message) => logger.info(`[Player] ${message}`));
    player.events.on('debug', (queue, message) =>
        logger.info(`[${queue.guild.name}: ${queue.guild.id}] ${message}`)
    );
    player.events.on('playerError', (queue, error) =>
        logger.info(`[${queue.guild.name}: ${queue.guild.id}] ${error}`)
    );
    player.events.on('error', (queue, error) =>
        logger.info(`[${queue.guild.name}: ${queue.guild.id}] ${error}`)
    );
}

client.run();

// prevent crash on unhandled promise rejection
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled promise rejection:\n`, reason);
});

// prevent crash on uncaught exception
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught exception:\n`, error);
});
