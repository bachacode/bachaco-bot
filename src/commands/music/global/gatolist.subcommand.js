const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const embedOptions = require('../../../config/embedOptions');
const { useDatabase } = require('../../../classes/Database');
const paginate = require('../../../helpers/paginate');
const previousButton = require('../../../components/gatoqueue/previousButton');
const nextButton = require('../../../components/gatoqueue/nextButton');
const refreshButton = require('../../../components/gatoqueue/refreshButton');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
const gatoListData = (subcommand) => {
    return subcommand
        .setName('list')
        .setDescription('Listado de las canciones guardadas en la playlist global');
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const gatoListExecute = async (interaction) => {
    const db = useDatabase();
    const client = interaction.client;
    let reply = '';
    await interaction.deferReply();

    try {
        const docs = await db.playlist.find({});

        if (docs.length === 0) {
            return await interaction.editReply({
                content: '¡No hay playlists registradas!'
            });
        }

        const playlists = paginate(docs);

        const page = playlists.getCurrentPageData();

        let message = '';
        page.forEach((playlist) => {
            message += `**[${playlist.id}]** ${playlist.name} — creada por: ${playlist.author} \n`;
        });

        const previous = previousButton(playlists.currentPage === 0);
        const next = nextButton(playlists.currentPage === playlists.data.length - 1);
        const refresh = refreshButton();
        const row = new ActionRowBuilder().addComponents(previous, next, refresh);

        const embedTitle = `Gato Playlists - Pag. ${playlists.currentPage + 1}`;

        const embed = new EmbedBuilder()
            .setTitle(embedTitle)
            .setDescription(message)
            .setColor(embedOptions.colors.default);

        reply = {
            embeds: [embed],
            components: [row]
        };
    } catch (error) {
        client.logger.error(error);
        reply = {
            embeds: [
                new EmbedBuilder()
                    .setDescription('¡Ha ocurrido un error al listar las playlists!')
                    .setColor(embedOptions.colors.error)
            ]
        };
    }

    if (interaction.deferred) {
        await interaction.editReply(reply);
    } else {
        await interaction.reply(reply);
    }
};

module.exports.gatoListData = gatoListData;
module.exports.gatoListExecute = gatoListExecute;
