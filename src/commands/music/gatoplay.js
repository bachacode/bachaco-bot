const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gatoplay')
    .setDescription('gatoc reproduce una canción.')
    .addStringOption((option) =>
      option.setName('query').setDescription('la URL de la canción.').setRequired(true)
    ),
  async execute ({ interaction }) {
    const player = useMainPlayer();

    // Revisa si el usuario esta conectado a un canal de voz.
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('No estas conectado a un canal de voz.');
    if (!channel.joinable) return interaction.reply('No puedo unirme a ese canal de voz.');

    // Revisa si ya hay un bot conectado a otro canal.
    const queue = useQueue(interaction.guild.id);
    if (queue && queue.channel !== channel) return interaction.reply('Ya estoy en otro canal de voz.');

    const query = interaction.options.getString('query', true);

    await interaction.deferReply();

    const result = await player.search(query);

    if (!result?.tracks.length) return interaction.editReply(`No se encontró la canción ${query}.`);

    try {
      await player.play(channel, result, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild.members.me,
            requestedBy: interaction.user
          },
          leaveOnEndCooldown: 300000,
          leaveOnEmptyCooldown: 30000
        }
      });
      await interaction.editReply({
        embeds: [
          new EmbedBuilder().setDescription(`🎶 | Se ha puesto **${result.tracks[0].title}** en la cola.`)
          .setThumbnail(result.tracks[0].thumbnail).setColor('DarkAqua')
        ]
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: '¡Ha ocurrido un error!\n'
      });
    }
  }
};
