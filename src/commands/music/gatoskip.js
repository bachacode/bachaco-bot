const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gatoskip')
        .setDescription('gatoc se salta la canción actual.'),
    async execute ({ interaction }) {
    // Revisa si hay una queue activa.
        const queue = useQueue(interaction.guild.id);
        if (!queue) return interaction.reply('No hay nada sonando elmio.');

        const currentSong = queue.currentTrack;
        queue.node.skip();

        try {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(`Se ha saltado **${currentSong.title}**`)
                        .setThumbnail(currentSong.thumbnail).setColor('DarkAqua')
                ]
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: '¡Ha ocurrido un error al saltar la canción!\n'
            });
        }
    }
};
