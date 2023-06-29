const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gatopause')
    .setDescription('gatoc pausa la canción actual.'),
  async execute ({ interaction }) {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);

    const embed = new EmbedBuilder().setColor('DarkAqua');
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    if(queue.node.isPaused()) {
      return interaction.reply({ embeds: [
      embed.setDescription('¡gatoc ya esta pausado!')]
    });
    }
    queue.node.setPaused(true);

    await interaction.reply({
      embeds: [
        embed.setDescription('¡gatoc ha pausado la cancion!')
      ]
    });
  }
};
