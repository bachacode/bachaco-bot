import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import embedOptions from '../../config/embedOptions.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoskip')
    .setDescription('gatoc se salta la canción actual.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);
    if (!queue) return await interaction.reply('No hay nada sonando elmio.');

    const currentSong = queue.currentTrack;
    queue.node.skip();

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`Se ha saltado **${currentSong.title}**`)
                .setThumbnail(currentSong.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};
