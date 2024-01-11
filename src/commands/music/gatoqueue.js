const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const paginate = require('../../helpers/paginate');
const embedOptions = require('../../config/embedOptions');
const previousButton = require('../../components/gatoqueue/previousButton');
const nextButton = require('../../components/gatoqueue/nextButton');
const refreshButton = require('../../components/gatoqueue/refreshButton');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').Track} Track */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoqueue')
    .setDescription('Replies with GatoPong!');

/**
 *
 * @param {Track[]} page
 * @param {Track} currentTrack
 * @param {number} currentPage
 * @returns {string}
 */
const getQueueMessage = (page, currentTrack, currentPage) => {
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
const execute = async (interaction) => {
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

module.exports = {
    data,
    execute
};

module.exports.getQueueMessage = getQueueMessage;
