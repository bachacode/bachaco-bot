require('dotenv').config();
const clientOptions = require('./config/clientOptions');
const GatoClient = require('./classes/GatoClient');
const GatoPlayer = require('./classes/GatoPlayer');
const token = process.env.TOKEN;
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
    client.logger.error('Unhandled promise rejection:', reason);
});

// prevent crash on uncaught exception
process.on('uncaughtException', (error) => {
    client.logger.error('Uncaught exception:', error);
});
