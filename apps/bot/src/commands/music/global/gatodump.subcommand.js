import { EmbedBuilder, ActionRowBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
import shuffle from '../../../helpers/shuffle.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */
/** @typedef {import('discord-player').Track} Track */

/** @param {Subcommand} subcommand */
export const gatoDumpData = (subcommand) => {
    return subcommand
        .setName('dump')
        .setDescription('Devuelve la playlist global como una playlist de youtube')
        .addBooleanOption((option) => {
            return option
                .setName('shuffled')
                .setDescription('If the playlist should be shuffled or not')
                .setRequired(false);
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const gatoDumpExecute = async (interaction) => {
    const db = useDatabase();
    const shuffled = interaction.options.getBoolean('shuffled', false);

    await interaction.deferReply();

    const playlistInfo = await db.playlist.aggregate([
        { $match: { id: 'global' } },
        { $limit: 1 },
        { $project: { _id: 0, totalTracks: { $size: '$tracks' } } }
    ]);

    const playlist = await db.playlist.findOne({ id: 'global' });
    console.log(playlist.tracks[0].metadata);
    let playlistUrl = 'https://www.youtube.com/watch_videos?video_ids=';

    if (shuffled != null && shuffled == true) {
        playlist.tracks = shuffle(playlist.tracks);
    }

    for (let track of playlist.tracks) {
        playlistUrl += `${track.metadata.id},`;
    }

    const embed = new EmbedBuilder()
        .setTitle(`Playlist - ${playlist.name}`)
        .setDescription(`[Enlace a la playlist en Youtube](<${playlistUrl}>)`)
        .setColor(embedOptions.colors.default)
        .setFooter({
            text: `Canciones totales: ${playlistInfo[0].totalTracks}`
        });

    await interaction.editReply({
        embeds: [embed]
    });
};
