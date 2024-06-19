import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue, useMainPlayer } from 'discord-player';
import embedOptions from '../../config/embedOptions.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoinsert')
    .setDescription('Mete una canción a un puesto especifico de la cola.')
    .addStringOption((option) => {
        return option.setName('query').setDescription('la URL de la canción.').setRequired(true);
    })
    .addNumberOption((option) => {
        return option
            .setName('position')
            .setDescription('Posición de la cola a insertar la canción')
            .setRequired(true);
    });

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const player = useMainPlayer();
    const queue = useQueue(interaction.guild.id);

    // Revisa si hay una queue activa.
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    const query = interaction.options.getString('query', true);
    let position = interaction.options.getNumber('position', true);
    const queueLength = queue.tracks.toArray().length;

    if (position <= 0) return interaction.reply('No puedes insertar una canción en esa posición');

    await interaction.deferReply();

    const searchResult = await player.search(query, { requestedBy: interaction.user });
    const song = searchResult.tracks[0];

    if (position >= queueLength) {
        queue.insertTrack(song, queueLength - 1);
        position = queueLength;
    } else {
        queue.insertTrack(song, position - 1);
    }

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `Se ha insertado **${song.title}** en la posicion **${position}** de la cola.`
                )
                .setThumbnail(song.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};
