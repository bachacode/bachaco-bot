const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const embedOptions = require('../../config/embedOptions');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatomove')
    .setDescription('Mueve una canción de posición en la cola.')
    .addNumberOption((option) => {
        return option.setName('track').setDescription('Posición de la canción').setRequired(true);
    })
    .addNumberOption((option) => {
        return option
            .setName('new')
            .setDescription('Nueva posición de la canción')
            .setRequired(true);
    });

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    // Revisa si hay una queue activa.
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    const old = interaction.options.getNumber('track', true);
    let position = interaction.options.getNumber('new', true);
    const track = queue.tracks.toArray()[old - 1];
    const queueLength = queue.tracks.toArray().length;

    if (position <= 0) return interaction.reply('No puedes insertar una canción en esa posición');

    if (position >= queueLength) {
        queue.moveTrack(track, queueLength - 1);
        position = queueLength;
    } else {
        queue.moveTrack(track, position - 1);
    }

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `Se ha movido **${track.title}** a la posición **${position}** de la cola.`
                )
                .setThumbnail(track.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};

module.exports = {
    data,
    execute
};
