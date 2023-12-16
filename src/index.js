require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, EmbedBuilder } = require('discord.js');
const { Player, useQueue } = require('discord-player');
const token = process.env.TOKEN;
const gatoId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const { paginate } = require('./helpers/paginate');
const clientOptions = require('./config/clientOptions');
const foldersPath = path.join(__dirname, 'commands');
const readyEvent = require('./events/client/readyEvent');
const commandHandlingEvent = require('./events/client/commandHandlingEvent');
const messageEvent = require('./events/client/messageEvent');
const GuildMemberAddEvent = require('./events/client/guildMemberAddEvent');
const guildMemberRemoveEvent = require('./events/client/guildMemberRemoveEvent');

// Create a new client instance
const client = new Client(clientOptions);

// Create a new player instance
const player = new Player(client);

// This method will load all the extractors from the @discord-player/extractor package
player.extractors.loadDefault();

let tracks = null;
client.commands = new Collection();
client.vxPrefix = true;

const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyEvent);

// Slash Command Handling
client.on(Events.InteractionCreate, commandHandlingEvent);

// Funny Replies Interactions
client.on(Events.MessageCreate, messageEvent);

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return; // Ignorar reacciones de otros bots

    const queue = useQueue(guildId);
    if (tracks == null && queue != null) {
        tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
    }
    // Previous Page
    if (
        tracks != null &&
        reaction.emoji.name === 'gatoC' &&
        reaction.message.author.id === gatoId
    ) {
        tracks.goPreviousPage();
        const currentPage = tracks.currentPage;
        const currentData = tracks.getCurrentPageData();
        let message = '';
        for (let index = 0; index < currentData.length; index++) {
            message += `**[${currentPage}${index}]** ${currentData[index].title}\n`;
        }
        const embeddedMessage = {
            embeds: [new EmbedBuilder().setTitle('Gato Cola').setDescription(message)]
        };
        reaction.message.edit(embeddedMessage);
        message = '';
    }

    // Next Page
    if (reaction.emoji.name === 'tobi' && reaction.message.author.id === gatoId) {
        tracks.goNextPage();
        const currentPage = tracks.currentPage;
        const currentData = tracks.getCurrentPageData();
        let message = '';
        for (let index = 0; index < currentData.length; index++) {
            message += `**[${currentPage}${index}]** ${currentData[index].title}\n`;
        }
        const embeddedMessage = {
            embeds: [new EmbedBuilder().setTitle('Gato Cola').setDescription(message)]
        };
        reaction.message.edit(embeddedMessage);
        message = '';
    }
});

// Mensaje de bienvenida
client.on(Events.GuildMemberAdd, GuildMemberAddEvent);

// Mensaje de despedida
client.on(Events.GuildMemberRemove, guildMemberRemoveEvent);

// this event is emitted whenever discord-player starts to play a track
player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(
        `Esta sonando **[${track.title} by ${track.author}](<${track.url}>)**`
    );
});

player.events.on('playerError', (queue, error) => {
    console.log(error);
});

player.events.on('error', (queue, error) => {
    console.log(error);
});

// Log in to Discord with your client's token
client.login(token);
