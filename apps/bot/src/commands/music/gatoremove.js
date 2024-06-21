import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import embedOptions from '../../config/embedOptions.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoremove')
    .setDescription('Quita una canción de la cola.')
    .addNumberOption((option) => {
        return option
            .setName('position')
            .setDescription('Número de la canción a quitar')
            .setRequired(true);
    });
/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);
    if (!queue) return await interaction.reply('No hay nada sonando elmio.');
    const trackNumber = interaction.options.getNumber('position', true) - 1;
    const track = queue.tracks.toArray()[trackNumber];
    queue.removeTrack(trackNumber);

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`Se ha removido **${track.title}** de la cola`)
                .setThumbnail(track.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};
