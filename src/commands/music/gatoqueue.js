const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
module.exports = {
  data: new SlashCommandBuilder().setName('gatoqueue').setDescription('Replies with GatoPong!'),
  async execute ({ interaction }) {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray(); //Converts the queue into a array of tracks
    const currentTrack = queue.currentTrack; //Gets the current track being played
    console.log(tracks)
    await interaction.reply('GatoPong!');
  }
};
