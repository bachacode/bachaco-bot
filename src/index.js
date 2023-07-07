require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const Replies = require('./Replies/Replies');
const funnyReplies = require('./Replies/FunnyReplies');
const funnyReactions = require('./Replies/FunnyReactions');
const funnyMessages = require('./Replies/FunnyMessages');
const token = process.env.token;

const replies = new Replies(funnyReplies, funnyReactions, funnyMessages);

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
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

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`¡Listo! Logeado como ${c.user.tag}`);
});

// Create a new player instance
const player = new Player(client);

// This method will load all the extractors from the @discord-player/extractor package
player.extractors.loadDefault();

// this event is emitted whenever discord-player starts to play a track
player.events.on('playerStart', (queue, track) => {
  // we will later define queue.metadata object while creating the queue
  queue.metadata.channel.send(`Esta sonando **${track.title} by ${track.author}**`);
});

// Slash Command Handling
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`El comando ${interaction.commandName} no existe.`);
    return;
  }

  try {
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '¡Ha ocurrido un error ejecutando el comando!',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '¡Ha ocurrido un error ejecutando el comando!',
        ephemeral: true
      });
    }
  }
});

// Funny Replies Interactions
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot === true) return;
  console.log(`${message.author.username}: ${message.content}`);
  replies.messages.push({ content: message.content, user: message.author.username });
  replies.checkMessage(message);
  if(message.content.includes('https://twitter.com')){
    let originalString = message.content;
    let pos = originalString.lastIndexOf('twitter.com');
    let replace = 'vx'
    let newString = originalString.slice(0, pos) + replace + originalString.slice(pos);
    message.delete().then(() => {
      message.channel.send(newString);
    })
  }
});

// Mensaje de bienvenida
client.on(Events.GuildMemberAdd, async (member) => {
  let channel = member.client.channels.cache.get('603201649099669526')
  let { user } = member;
  member.roles.add('603340605774626871');
  let name = `<@${user.id}>`;

  let embed = new EmbedBuilder()
    .setColor('Aqua')
    .setTitle('qlq <:gatoC:957421664738639872> 🍷')
    .setDescription(`${name} acaba de cometer el error mas grande de su vida entrando a esta tierra profana.`)
    channel.send({
      embeds:[ 
        embed
      ]
    });
})

// Mensaje de despedida
client.on(Events.GuildMemberRemove, async (member) => {
  let channel = member.client.channels.cache.get('603201649099669526')
  let { user } = member;

  let name = `<@${user.id}>`;

  let embed = new EmbedBuilder()
    .setColor('Aqua')
    .setTitle('c le fue la luz <:sadcheems:869742943425151087>')
    .setDescription(`${name} no aguanto la pela.`)
    channel.send({
      embeds:[ 
        embed
      ]
    });
})

// Log in to Discord with your client's token
client.login(token);
