const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoskip')
    .setDescription('gatoc se salta la canción actual.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    const currentSong = queue.currentTrack;
    queue.node.skip();

    try {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Se ha saltado **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
                    .setColor('DarkAqua')
            ]
        });
    } catch (error) {
        console.error(error);
        await interaction.editReply({
            content: '¡Ha ocurrido un error al saltar la canción!\n'
        });
    }
};

module.exports = {
    data,
    execute
};
