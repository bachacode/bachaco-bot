const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatocurrent')
    .setDescription('gatoc dice la canción que esta sonando actualmente.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);

    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    const currentSong = queue.currentTrack;

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Enlace a la canción')
                .setURL(currentSong.url)
                .setDescription(`🎶 | Esta sonando **${currentSong.title}.**`)
                .setThumbnail(currentSong.thumbnail)
                .setColor('DarkAqua')
        ]
    });
};

module.exports = {
    data,
    execute
};
