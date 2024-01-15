const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, serialize, useMainPlayer } = require('discord-player');
const embedOptions = require('../../config/embedOptions');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatosave')
    .setDescription('Guarda canciones en listas')
    .addSubcommand((subcommand) => {
        return subcommand
            .setName('playlist')
            .setDescription('Guarda una playlist de YouTube')
            .addStringOption((option) => {
                return option.setName('query').setDescription('Enlace de la playlist');
            })
            .addStringOption((option) => {
                return option.setName('name').setDescription('Nombre de la playlist (opcional)');
            });
    });

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
const savePlaylist = async (interaction, queue) => {
    const query = interaction.options.getString('query', false);
    const player = useMainPlayer();
    let playlist;
    if (query !== null) {
        interaction.deferReply();
        const searchResult = await player.search(query, { requestedBy: interaction.user });
        if (searchResult.playlist === null) {
            return interaction.editReply('El enlace no pertenece a ninguna playlist');
        }

        playlist = searchResult.playlist;
    } else {
        const track = queue.tracks.toArray()[0];
        if (track.playlist === null) {
            return interaction.editReply('La canción actual no pertenece a ninguna playlist');
        }
        playlist = track.playlist;
    }

    const serializedTracks = playlist.tracks.map((track) => serialize(track));

    const playlistName = interaction.options.getString('name', false) ?? playlist.title;
    const thumbnail = playlist.tracks[0].thumbnail;
    // save to db;
    // await database.save('my-queue', serializedTracks);
    console.log(serializedTracks);

    const reply = {
        embeds: [
            new EmbedBuilder()
                .setTitle('Enlace a la playlist')
                .setURL(playlist.url)
                .setDescription(`📼 | Se ha guardado la playlist: **${playlistName}**`)
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

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    if (interaction.options.getSubcommand() === 'playlist') {
        savePlaylist(interaction, queue);
    }
};

module.exports = {
    data,
    execute
};
