import { EmbedBuilder, ActionRowBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
import refreshButton from '../../../components/gatoglobal/refreshButton.js';
import fullPreviousButtonGlobal from '../../../components/gatoglobal/fullPreviousButton.js';
import nextButtonGlobal from '../../../components/gatoglobal/nextButton.js';
import previousButtonGlobal from '../../../components/gatoglobal/previousButton.js';
import fullNextButtonGlobal from '../../../components/gatoglobal/fullNextButton.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoListData = (subcommand) => {
    return subcommand
        .setName('list')
        .setDescription('Listado de las canciones guardadas en la playlist global')
        .addNumberOption((option) => {
            return option.setName('page').setDescription('Página de playlist').setRequired(false);
        });
};

/**
 *
 * @param {Track[]} tracks
 * @param {Track} currentTrack
 * @param {number} currentPage
 * @returns {string}
 */
export const getGlobalMessage = (tracks, currentPage) => {
    let message = '';
    tracks.forEach((track, i) => {
        const songNumber = i + 1 + (currentPage - 1) * 10;
        message += `**[${songNumber}]** ${track.title}\n`;
    });

    return message;
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const gatoListExecute = async (interaction) => {
    const db = useDatabase();
    const pageNumber = interaction.options.getNumber('page', false) ?? 1;
    const pageSize = 10;

    await interaction.deferReply();

    const playlistInfo = await db.playlist.aggregate([
        { $match: { id: 'global' } },
        { $limit: 1 },
        { $project: { _id: 0, totalTracks: { $size: '$tracks' } } }
    ]);

    const totalPages = Math.ceil(playlistInfo[0].totalTracks / pageSize);

    // Check if the page number is within the valid range
    if (pageNumber < 1 || pageNumber > totalPages) {
        return interaction.editReply(
            `Número de página inválido. Por favor, elija un número de página entre 1 y ${totalPages}.`
        );
    }

    const globalPlaylist = await db.playlist.aggregate([
        { $match: { id: 'global' } },
        { $limit: 1 },
        {
            $project: {
                _id: 0,
                name: 1,
                url: 1,
                totalPages: { $ceil: { $divide: [{ $size: '$tracks' }, pageSize] } },
                paginatedTracks: { $slice: ['$tracks', (pageNumber - 1) * pageSize, pageSize] }
            }
        }
    ]);

    const message = getGlobalMessage(globalPlaylist[0].paginatedTracks, pageNumber);

    const fullPrevious = fullPreviousButtonGlobal(pageNumber === 1);
    const previous = previousButtonGlobal(pageNumber === 1);
    const next = nextButtonGlobal(pageNumber === globalPlaylist[0].totalPages);
    const fullNext = fullNextButtonGlobal(pageNumber === globalPlaylist[0].totalPages);
    const refresh = refreshButton();
    const row = new ActionRowBuilder().addComponents(
        fullPrevious,
        previous,
        next,
        fullNext,
        refresh
    );

    const embed = new EmbedBuilder()
        .setTitle(`Playlist - ${globalPlaylist[0].name}`)
        .setDescription(message)
        .setColor(embedOptions.colors.default)
        .setFooter({
            text: `Pág. ${pageNumber} de ${totalPages} | Canciones totales: ${playlistInfo[0].totalTracks}`
        });

    await interaction.editReply({
        embeds: [embed],
        components: [row]
    });
};
