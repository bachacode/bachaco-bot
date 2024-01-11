const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embedOptions = require('../../config/embedOptions');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoswap')
    .setDescription('Intercambia las posiciones de dos canciones en la cola.')
    .addNumberOption((option) => {
        return option.setName('first').setDescription('Posición de la canción').setRequired(true);
    })
    .addNumberOption((option) => {
        return option
            .setName('second')
            .setDescription('Posición de la segunda canción')
            .setRequired(true);
    });

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    // Revisa si hay una queue activa.
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    const first = interaction.options.getNumber('first', true);
    const second = interaction.options.getNumber('second', true);
    const track = queue.tracks.toArray()[first - 1];
    let trackTwo;
    const queueLength = queue.tracks.toArray().length;

    if (first <= 0 || second <= 0) {
        return interaction.reply(
            `No hay ninguna canción en la posicion ${first} o ${second} de la cola`
        );
    } else if (first === second) {
        return interaction.reply('No puedes intercambiar una canción consigo misma');
    }

    if (second >= queueLength) {
        trackTwo = queue.tracks.toArray()[queueLength - 1];
        queue.swapTracks(track, trackTwo);
    } else {
        trackTwo = queue.tracks.toArray()[second - 1];
        queue.swapTracks(track, trackTwo);
    }

    const embeds = [
        new EmbedBuilder()
            .setDescription(`Se ha movido **${track.title}** a la posición ${second} de la cola.`)
            .setThumbnail(track.thumbnail)
            .setColor(embedOptions.colors.default),
        new EmbedBuilder()
            .setDescription(`Se ha movido **${trackTwo.title}** a la posición ${first} de la cola.`)
            .setThumbnail(trackTwo.thumbnail)
            .setColor(embedOptions.colors.default)
    ];

    await interaction.reply({
        embeds
    });
};

module.exports = {
    data,
    execute
};
