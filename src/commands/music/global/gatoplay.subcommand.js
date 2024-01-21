const { EmbedBuilder } = require('discord.js');
const { useMainPlayer, deserialize, useQueue } = require('discord-player');
const embedOptions = require('../../../config/embedOptions');
const { useDatabase } = require('../../../classes/Database');
const playerOptions = require('../../../config/playerOptions');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
const gatoPlayData = (subcommand) => {
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

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
const gatoPlayExecute = async (interaction) => {
    const player = useMainPlayer();
    const db = useDatabase();

    // Revisa si el usuario esta conectado a un canal de voz.
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('No estas conectado a un canal de voz.');
    if (!channel.joinable) return interaction.reply('No puedo unirme a ese canal de voz.');

    // Revisa si ya hay un bot conectado a otro canal.
    const queue = useQueue(interaction.guild.id);
    if (queue && queue.channel !== channel) {
        return interaction.reply('Ya estoy en otro canal de voz.');
    }

    await interaction.deferReply();

    try {
        const globalPlaylist = await db.playlist.findOne({ id: 'global' });
        const position = interaction.options.getNumber('position', false);
        if (globalPlaylist === null) {
            return await interaction.editReply('La playlist global todavia no ha sido creada');
        }

        globalPlaylist.tracks.splice(0, position - 1);

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

        if (tracks.length === 0) {
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
                    .setDescription('🎶 | Se ha puesto la playlist global en la cola.')
                    .setThumbnail(tracks[0].thumbnail)
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
            ],
            ephemeral: true
        });
    }
};

module.exports.gatoPlayData = gatoPlayData;
module.exports.gatoPlayExecute = gatoPlayExecute;
