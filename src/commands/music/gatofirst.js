const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const embedOptions = require('../../config/embedOptions');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatofirst')
    .setDescription('Mete una canción como la primera de la cola.')
    .addStringOption((option) => {
        return option.setName('query').setDescription('la URL de la canción.').setRequired(true);
    });

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const player = useMainPlayer();
    const queue = useQueue(interaction.guild.id);

    // Revisa si hay una queue activa.
    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    const query = interaction.options.getString('query', true);

    await interaction.deferReply();

    const searchResult = await player.search(query, { requestedBy: interaction.user });
    const song = searchResult.tracks[0];

    queue.insertTrack(song, 0);

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `Se ha insertado **${song.title}** en la primera posición de la cola.`
                )
                .setThumbnail(song.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};

module.exports = {
    data,
    execute
};
