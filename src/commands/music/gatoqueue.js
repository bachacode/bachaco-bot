import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import paginate from '../../helpers/paginate.js';
import embedOptions from '../../config/embedOptions.js';
import previousButton from '../../components/gatoqueue/previousButton.js';
import nextButton from '../../components/gatoqueue/nextButton.js';
import refreshButton from '../../components/gatoqueue/refreshButton.js';
import fullPreviousButton from '../../components/gatoqueue/fullPreviousButton.js';
import fullNextButton from '../../components/gatoqueue/fullNextButton.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').Track} Track */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoqueue')
    .setDescription('Replies with GatoPong!')
    .addNumberOption((option) => {
        return option.setName('page').setDescription('Página de playlist').setRequired(false);
    });

/**
 *
 * @param {Track[]} page
 * @param {Track} currentTrack
 * @param {number} currentPage
 * @returns {string}
 */
export const getQueueMessage = (page, currentTrack, currentPage) => {
    let message = `**[Esta sonando]** ${currentTrack.title}\n----------------------------------------\n`;

    page.forEach((track, i) => {
        const songNumber = i + 1 + currentPage * 10;
        message += `**[${songNumber}]** ${track.title}\n`;
    });

    return message;
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);
    const pageNumber = interaction.options.getNumber('page', false) ?? 0;
    if (!queue) return interaction.reply('No hay nada sonando elmio.');
    if (queue.tracks.toArray().length === 0) return interaction.reply('No hay canciones en cola');
    // Check if the page number is within the valid range
    const currentTrack = queue.currentTrack;
    const tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
    if (pageNumber < 1 || pageNumber > tracks.data.length) {
        return interaction.editReply(
            `Número de página inválido. Por favor, elija un número de página entre 1 y ${tracks.data.length}.`
        );
    }
    tracks.goToPage(pageNumber - 1);
    const page = tracks.getCurrentPageData();
    const totalTracks = tracks.data.reduce((sum, currentArray) => sum + currentArray.length, 0);
    const message = getQueueMessage(page, currentTrack, tracks.currentPage);

    const fullPrevious = fullPreviousButton(tracks.currentPage === 0);
    const previous = previousButton(tracks.currentPage === 0);
    const next = nextButton(tracks.currentPage === tracks.data.length - 1);
    const fullNext = fullNextButton(tracks.currentPage === tracks.data.length - 1);
    const refresh = refreshButton();
    const row = new ActionRowBuilder().addComponents(
        fullPrevious,
        previous,
        next,
        fullNext,
        refresh
    );

    const embed = new EmbedBuilder()
        .setTitle('Gato Cola')
        .setDescription(message)
        .setColor(embedOptions.colors.default)
        .setFooter({
            text: `Pág. ${tracks.currentPage + 1} de ${
                tracks.data.length
            } | Canciones totales: ${totalTracks}`
        });
    await interaction.reply({
        embeds: [embed],
        components: [row]
    });
};
