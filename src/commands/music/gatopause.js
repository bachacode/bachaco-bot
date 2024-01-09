const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embedOptions = require('../../config/embedOptions');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatopause')
    .setDescription('gatoc pausa o reanuda la musica.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);

    const embed = new EmbedBuilder();

    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    await interaction.deferReply();
    // Pausa o reanuda la cola
    queue.node.setPaused(!queue.node.isPaused());

    const currentSong = queue.currentTrack;

    const embedDescription = queue.node.isPaused()
        ? `🎶 | Se ha pausado la canción: **${currentSong.title}.**`
        : `🎶 | Se ha reanudado la canción: **${currentSong.title}.**`;

    embed
        .setDescription(embedDescription)
        .setThumbnail(currentSong.thumbnail)
        .setColor(embedOptions.colors.default);

    await interaction.editReply({
        embeds: [embed]
    });
};

module.exports = {
    data,
    execute
};
