const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const embedOptions = require('../../../config/embedOptions');
const { useDatabase } = require('../../../classes/Database');
const paginate = require('../../../helpers/paginate');
const previousButton = require('../../../components/gatoqueue/previousButton');
const nextButton = require('../../../components/gatoqueue/nextButton');
const refreshButton = require('../../../components/gatoqueue/refreshButton');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatolist')
    .setDescription('Listado de las playlists guardadas');

const getPlaylistsMessage = (page, currentPage) => {
    let message = '';
    page.forEach((playlist, i) => {
        const playlistNumber = i + 1 + currentPage * 10;
        message += `**[${playlistNumber}]** ${playlist.name}\n`;
    });

    return message;
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const db = useDatabase();
    const client = interaction.client;
    await interaction.deferReply();

    try {
        const docs = await db.playlist.find({});
        const playlists = paginate(docs);

        const page = playlists.getCurrentPageData();

        const message = getPlaylistsMessage(page, playlists.currentPage);

        const previous = previousButton(playlists.currentPage === 0);
        const next = nextButton(playlists.currentPage === playlists.data.length - 1);
        const refresh = refreshButton();
        const row = new ActionRowBuilder().addComponents(previous, next, refresh);

        const embedTitle = `Gato Playlists - Pag. ${playlists.currentPage + 1}`;

        const embed = new EmbedBuilder()
            .setTitle(embedTitle)
            .setDescription(message)
            .setColor(embedOptions.colors.default);

        await interaction.editReply({
            embeds: [embed],
            components: [row]
        });
    } catch (error) {
        client.logger.error(error);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('¡Ha ocurrido un error al listar las playlists!')
                    .setColor(embedOptions.colors.error)
            ]
        });
    }
};

module.exports = {
    data,
    execute
};
