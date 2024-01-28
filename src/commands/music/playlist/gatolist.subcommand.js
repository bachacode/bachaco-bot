import { EmbedBuilder, ActionRowBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
import paginate from '../../../helpers/paginate.js';
import previousButton from '../../../components/gatoqueue/previousButton.js';
import nextButton from '../../../components/gatoqueue/nextButton.js';
import refreshButton from '../../../components/gatoqueue/refreshButton.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoListData = (subcommand) => {
    return subcommand.setName('list').setDescription('Listado de las playlists guardadas');
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const gatoListExecute = async (interaction) => {
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
