import { EmbedBuilder } from 'discord.js';
import { useMainPlayer, deserialize, useQueue } from 'discord-player';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
import playerOptions from '../../../config/playerOptions.js';
import shuffle from '../../../helpers/shuffle.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoPlayData = (subcommand) => {
    return subcommand
        .setName('play')
        .setDescription('Reproduce la playlist global')
        .addNumberOption((option) => {
            return option
                .setName('position')
                .setDescription('Posición de la que quieres comenzar')
                .setRequired(false);
        });
};

/** @param {Subcommand} subcommand */
export const gatoRandomData = (subcommand) => {
    return subcommand
        .setName('randomlocke')
        .setDescription('Reproduce la playlist global en modo random')
        .addNumberOption((option) => {
            return option
                .setName('position')
                .setDescription('Posición de la que quieres comenzar')
                .setRequired(false);
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {number|null} position
 * @param {import('discord.js').Channel} channel
 * @returns {import('discord-player').Playlist}
 */
const getPlaylist = async (interaction, position, channel) => {
    const player = useMainPlayer();
    const db = useDatabase();

    // Revisa si el usuario esta conectado a un canal de voz.
    if (!channel) return interaction.reply('No estas conectado a un canal de voz.');
    if (!channel.joinable) return interaction.reply('No puedo unirme a ese canal de voz.');

    // Revisa si ya hay un bot conectado a otro canal.
    const queue = useQueue(interaction.guild.id);
    if (queue && queue.channel !== channel) {
        return interaction.reply('Ya estoy en otro canal de voz.');
    }

    await interaction.deferReply();

    const globalPlaylist = await db.playlist.findOne({ id: 'global' });

    if (globalPlaylist === null) {
        return await interaction.editReply('La playlist global todavia no ha sido creada');
    }

    if (position !== null) {
        globalPlaylist.tracks.splice(0, position - 1);
    }

    const playlist = player.createPlaylist({
        author: {
            name: interaction.user.username,
            url: ''
        },
        description: '',
        id: globalPlaylist.id,
        source: 'arbitrary',
        thumbnail: '',
        title: globalPlaylist.name,
        tracks: [],
        type: 'playlist',
        url: ''
    });

    const tracks = globalPlaylist.tracks.map((track) => {
        const song = deserialize(player, track);

        song.playlist = playlist;

        return song;
    });

    playlist.tracks = tracks;

    return playlist;
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoPlayExecute = async (interaction) => {
    const player = useMainPlayer();
    const position = interaction.options.getNumber('position', false);
    const channel = interaction.member.voice.channel;
    let embedMsg = '🎶 | Se ha puesto la playlist global en la cola.';

    if (position !== null) {
        embedMsg = `🎶 | Se ha puesto la playlist global en la cola empezando desde la posición \`${position}\`.`;
    }
    try {
        const playlist = await getPlaylist(interaction, position, channel);

        if (playlist.tracks.length === 0) {
            return interaction.editReply('La playlist global no tiene canciones.');
        }

        await player.play(channel, playlist, {
            nodeOptions: {
                ...playerOptions,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                }
            }
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Playlist Global')
                    .setDescription(embedMsg)
                    .setThumbnail(playlist.tracks[0].thumbnail)
                    .setColor(embedOptions.colors.default)
            ]
        });
    } catch (error) {
        console.log(error);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Ha ocurrido un error')
                    .setDescription(
                        'Ha ocurrido un error inesperado, revise la consola para solucionarlo'
                    )
                    .setColor(embedOptions.colors.error)
            ]
        });
    }
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoRandomExecute = async (interaction) => {
    const player = useMainPlayer();
    const position = interaction.options.getNumber('position', false);
    const channel = interaction.member.voice.channel;
    let embedMsg = '🎶 | Se ha puesto la playlist global en la cola en modo aleatorio.';

    if (position !== null) {
        embedMsg = `🎶 | Se ha puesto la playlist global en la cola en modo aleatorio empezando desde la posición \`${position}\`.`;
    }
    try {
        const playlist = await getPlaylist(interaction, position, channel);

        if (playlist.tracks.length === 0) {
            return interaction.editReply('La playlist global no tiene canciones.');
        }

        playlist.tracks = shuffle(playlist.tracks);

        await player.play(channel, playlist, {
            nodeOptions: {
                ...playerOptions,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                }
            }
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Playlist Global')
                    .setDescription(embedMsg)
                    .setThumbnail(playlist.tracks[0].thumbnail)
                    .setColor(embedOptions.colors.default)
            ]
        });
    } catch (error) {
        console.log(error);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Ha ocurrido un error')
                    .setDescription(
                        'Ha ocurrido un error inesperado, revise la consola para solucionarlo'
                    )
                    .setColor(embedOptions.colors.error)
            ]
        });
    }
};
