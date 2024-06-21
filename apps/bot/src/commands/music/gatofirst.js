import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue, useMainPlayer } from 'discord-player';
import embedOptions from '../../config/embedOptions.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatofirst')
    .setDescription('Mete una canción como la primera de la cola.')
    .addStringOption((option) => {
        return option
            .setName('song')
            .setDescription('la URL o posición de la canción.')
            .setRequired(true);
    });

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const player = useMainPlayer();
    const queue = useQueue(interaction.guild.id);

    // Revisa si hay una queue activa.
    if (!queue) return await interaction.reply('No hay nada sonando elmio.');

    const query = interaction.options.getString('song', true);
    let searchResult = '';
    let song;
    await interaction.deferReply();

    if (isNaN(query)) {
        searchResult = await player.search(query, { requestedBy: interaction.user });
        song = searchResult.tracks[0];
    } else {
        const position =
            queue.tracks.toArray().length >= parseInt(query)
                ? parseInt(query) - 1
                : queue.tracks.toArray().length - 1;

        if (position < 0) {
            return await interaction.editReply('La posición no puede ser igual o menor a 0');
        } else if (position === 0) {
            return await interaction.editReply(
                'Como vas a poner la primera canción de primera tonto aweonao'
            );
        }
        song = queue.tracks.toArray()[position];
    }

    queue.insertTrack(song, 0);

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `Se ha colocado **${song.title}** en la primera posición de la cola.`
                )
                .setThumbnail(song.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};
