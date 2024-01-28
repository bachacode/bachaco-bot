import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import paginate from '../../helpers/paginate.js';
import embedOptions from '../../config/embedOptions.js';
import previousButton from '../../components/gatoqueue/previousButton.js';
import nextButton from '../../components/gatoqueue/nextButton.js';
import refreshButton from '../../components/gatoqueue/refreshButton.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').Track} Track */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoqueue')
    .setDescription('Replies with GatoPong!');

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

    if (!queue) return interaction.reply('No hay nada sonando elmio.');
    if (queue.tracks.toArray().length === 0) return interaction.reply('No hay canciones en cola');

    const currentTrack = queue.currentTrack;
    const tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks

    const page = tracks.getCurrentPageData();

    const message = getQueueMessage(page, currentTrack, tracks.currentPage);

    const previous = previousButton(tracks.currentPage === 0);
    const next = nextButton(tracks.currentPage === tracks.data.length - 1);
    const refresh = refreshButton();
    const row = new ActionRowBuilder().addComponents(previous, next, refresh);

    const embedTitle = `Gato Cola - Pag. ${tracks.currentPage + 1}`;

    const embed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(message)
        .setColor(embedOptions.colors.default);

    await interaction.reply({
        embeds: [embed],
        components: [row]
    });
};
