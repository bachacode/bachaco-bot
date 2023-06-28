const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gatoskip')
    .setDescription('Skips the current song!'),
  async execute ({ client, interaction }) {
    const queue = client.player.nodes.get(interaction.guild);

    if (!queue) {
      await interaction.reply('No hay nada sonando elmio.');
      return;
    }
    const currentSong = queue.current;

    queue.skip();

    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(`Skipped **${currentSong.title}**`)
          .setThumbnail(currentSong.thumbnail)
      ]
    });
  }
};
