require('dotenv').config();
const token = process.env.TOKEN;
const clientOptions = require('./config/clientOptions');
const GatoClient = require('./classes/GatoClient');
const GatoPlayer = require('./classes/GatoPlayer');

// Create a new client instance
const client = new GatoClient(clientOptions, __dirname, token);

// Create a new player instance
const player = new GatoPlayer(client, __dirname);
player.once('debug', (message) => {
    console.log(message);
});

client.run();
// let tracks = null;

// client.on(Events.MessageReactionAdd, async (reaction, user) => {
//     if (user.bot) return; // Ignorar reacciones de otros bots

//     const queue = useQueue(guildId);
//     if (tracks == null && queue != null) {
//         tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
//     }
//     // Previous Page
//     if (
//         tracks != null &&
//         reaction.emoji.name === 'gatoC' &&
//         reaction.message.author.id === gatoId
//     ) {
//         tracks.goPreviousPage();
//         const currentPage = tracks.currentPage;
//         const currentData = tracks.getCurrentPageData();
//         let message = '';
//         for (let index = 0; index < currentData.length; index++) {
//             message += `**[${currentPage}${index}]** ${currentData[index].title}\n`;
//         }
//         const embeddedMessage = {
//             embeds: [new EmbedBuilder().setTitle('Gato Cola').setDescription(message)]
//         };
//         reaction.message.edit(embeddedMessage);
//         message = '';
//     }

//     // Next Page
//     if (reaction.emoji.name === 'tobi' && reaction.message.author.id === gatoId) {
//         tracks.goNextPage();
//         const currentPage = tracks.currentPage;
//         const currentData = tracks.getCurrentPageData();
//         let message = '';
//         for (let index = 0; index < currentData.length; index++) {
//             message += `**[${currentPage}${index}]** ${currentData[index].title}\n`;
//         }
//         const embeddedMessage = {
//             embeds: [new EmbedBuilder().setTitle('Gato Cola').setDescription(message)]
//         };
//         reaction.message.edit(embeddedMessage);
//         message = '';
//     }
// });
