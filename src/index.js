const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const Replies = require('./Replies/Replies');
require('dotenv').config();

const token = process.env.token;
const funnyReplies = [
  { request: 'marico', response: 'eres' },
  { request: 'verga', response: 'comes' },
  { request: 'gatoc', response: '<:gatoC:957421664738639872> 🍷' },
  {
    request: 'boku no hero',
    response:
      'https://cdn.discordapp.com/attachments/801954893437861918/958565875961716736/unknown.png'
  },
  {
    request: 'mediocre',
    response:
      'https://cdn.discordapp.com/attachments/801954893437861918/958565875961716736/unknown.png'
  },
  { request: 'women', response: '☕' },
  { request: 'contexto', response: 'https://i.ytimg.com/vi/x6aBFSJHslE/hqdefault.jpg' },
  { request: 'litio', response: '🐒' }
];
const funnyReactions = [
  { request: '<:gatoC:957421664738639872>', response: ':gatoC:957421664738639872' }
];
const replies = new Replies(funnyReplies, funnyReactions);

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
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

client.player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  }
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Slash Command Handling
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  }
});

// Funny Replies Interactions
client.on(Events.MessageCreate, async (message) => {
  console.log(`${message.author.username}: ${message.content}`);
  if (message.author.bot === true) return;
  replies.messages.push({ content: message.content, user: message.author.username });
  replies.replyToMsg(message);
  replies.reactToMsg(message);
  replies.chainThree(message);
});

// Log in to Discord with your client's token
client.login(token);
