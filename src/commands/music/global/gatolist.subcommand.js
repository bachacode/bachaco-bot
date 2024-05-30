import { EmbedBuilder, ActionRowBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
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
    const pageNumber = 1;
    const pageSize = 10;
    await interaction.deferReply();

    const globalPlaylist = await db.playlist
        .aggregate([
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
        ])
        .catch((err) => {
            console.log(err);
            return interaction.editReply('error al buscar la playlist');
        });

    const message = getGlobalMessage(globalPlaylist[0].paginatedTracks, pageNumber);

    const previous = previousButton(pageNumber === 1);
    const next = nextButton(pageNumber === globalPlaylist[0].totalPages);
    const refresh = refreshButton();
    const row = new ActionRowBuilder().addComponents(previous, next, refresh);

    const embedTitle = `Gato Global - Pag. ${pageNumber}`;

    const embed = new EmbedBuilder()
        .setTitle(embedTitle)
        .setDescription(message)
        .setColor(embedOptions.colors.default);

    await interaction.editReply({
        embeds: [embed],
        components: [row]
    });
};
