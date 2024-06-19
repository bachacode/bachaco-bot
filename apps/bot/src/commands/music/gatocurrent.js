import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import embedOptions from '../../config/embedOptions.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatocurrent')
    .setDescription('gatoc dice la canción que esta sonando actualmente.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
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
                .setColor(embedOptions.colors.default)
        ]
    });
};
