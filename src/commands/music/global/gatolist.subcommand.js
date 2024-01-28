import { EmbedBuilder, ActionRowBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
import paginate from '../../../helpers/paginate.js';
import previousButton from '../../../components/gatoglobal/previousButton.js';
import nextButton from '../../../components/gatoglobal/nextButton.js';
import refreshButton from '../../../components/gatoglobal/refreshButton.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoListData = (subcommand) => {
    return subcommand
        .setName('list')
        .setDescription('Listado de las canciones guardadas en la playlist global');
};

/**
 *
 * @param {Track[]} page
 * @param {Track} currentTrack
 * @param {number} currentPage
 * @returns {string}
 */
export const getGlobalMessage = (page, currentPage) => {
    let message = '';
    page.forEach((track, i) => {
        const songNumber = i + 1 + currentPage * 10;
        message += `**[${songNumber}]** ${track.title}\n`;
    });

    return message;
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const gatoListExecute = async (interaction) => {
    const db = useDatabase();

    await interaction.deferReply();

    const globalPlaylist = await db.playlist.findOne({ id: 'global' }).catch((err) => {
        console.log(err);
        return interaction.editReply('error al buscar la playlist');
    });

    const tracks = paginate(globalPlaylist.tracks, 10); // Converts the queue into a array of tracks

    const page = tracks.getCurrentPageData();

    const message = getGlobalMessage(page, tracks.currentPage);

    const previous = previousButton(tracks.currentPage === 0);
    const next = nextButton(tracks.currentPage === tracks.data.length - 1);
    const refresh = refreshButton();
    const row = new ActionRowBuilder().addComponents(previous, next, refresh);

    const embedTitle = `Gato Global - Pag. ${tracks.currentPage + 1}`;

    const embed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(message)
        .setColor(embedOptions.colors.default);

    await interaction.editReply({
        embeds: [embed],
        components: [row]
    });
};
