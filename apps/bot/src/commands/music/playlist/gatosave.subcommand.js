import { EmbedBuilder } from 'discord.js';
import { serialize, useMainPlayer, useQueue } from 'discord-player';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoSaveData = (subcommand) => {
    return subcommand
        .setName('save')
        .setDescription('Guarda una playlist de youtube')
        .addStringOption((option) => {
            return option.setName('query').setDescription('Enlace de la playlist');
        })
        .addStringOption((option) => {
            return option.setName('name').setDescription('Nombre de la playlist (opcional)');
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoSaveExecute = async (interaction) => {
    const query = interaction.options.getString('query', false);
    const queue = useQueue(interaction.guild.id);
    const player = useMainPlayer();
    const db = useDatabase();
    let playlist, reply;

    if (query !== null) {
        interaction.deferReply();
        const searchResult = await player.search(query, { requestedBy: interaction.user });
        if (searchResult.playlist === null) {
            return interaction.editReply('El enlace no pertenece a ninguna playlist');
        }

        playlist = searchResult.playlist;
    } else {
        if (!queue) return interaction.reply('No hay nada sonando elmio.');
        const track = queue.tracks.toArray()[0];
        if (track.playlist === null) {
            return interaction.editReply('La canción actual no pertenece a ninguna playlist');
        }
        playlist = track.playlist;
    }

    const serializedTracks = playlist.tracks.map((track) => serialize(track));

    const playlistName = interaction.options.getString('name', false) ?? playlist.title;
    const playlistUrl = playlist.url;
    const thumbnail = playlist.tracks[0].thumbnail;

    try {
        playlist = await db.playlist.create({
            name: playlistName,
            author: interaction.user.id,
            url: playlistUrl,
            tracks: serializedTracks
        });
    } catch (error) {
        console.error(error);

        reply = {
            embeds: [
                new EmbedBuilder()
                    .setDescription(error)
                    .setThumbnail(thumbnail)
                    .setColor(embedOptions.colors.error)
            ]
        };
    }

    reply = {
        embeds: [
            new EmbedBuilder()
                .setTitle('Enlace a la playlist')
                .setURL(playlist.url)
                .setDescription(`📼 | Se ha guardado la playlist: **${playlist.name}**`)
                .setThumbnail(thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    };

    if (interaction.deferred) {
        await interaction.editReply(reply);
    } else {
        await interaction.reply(reply);
    }
};
