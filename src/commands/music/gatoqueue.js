const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder().setName('gatoqueue').setDescription('Replies with GatoPong!'),
  async execute ({ interaction }) {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray(); //Converts the queue into a array of tracks
    let message = '';
    for (let index = 0; index < 10; index++) {
      console.log(tracks[index]);
      // message += `**[${index}]** ${tracks[index].author} - ${tracks[index].title}\n`;
    }
    // const embeddedMessage = {
    //   embeds:[ 
    //     new EmbedBuilder().setTitle('titulo').setDescription(message)
    //   ]
    // };
    // const currentTrack = queue.currentTrack; //Gets the current track being played
    // console.log(tracks)
    // await interaction.reply(embeddedMessage);
  }
};
