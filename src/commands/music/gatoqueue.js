const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');
const { useQueue } = require('discord-player');
const paginate = require('../../helpers/paginate');
const embedOptions = require('../../config/embedOptions');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoqueue')
    .setDescription('Replies with GatoPong!');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) return interaction.reply('No hay nada sonando elmio.');
    if (queue.tracks.toArray() === 0) return interaction.reply('No hay canciones en cola');

    const currentTrack = queue.currentTrack;
    const tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
    let message = '';

    message += `**[0]** ${currentTrack.title}\n`;

    const page = tracks.getCurrentPageData();

    for (let index = 0; index < 10; index++) {
        const songNumber = (index + 1) * (tracks.currentPage + 1);
        if (!page[index]) continue;
        message += `**[${songNumber}]** ${page[index].title}\n`;
    }

    const previous = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('patra')
        .setEmoji('<:miau:800244696349802537>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(tracks.currentPage === 0);

    const next = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('palante')
        .setEmoji('<:dwayne:1050074917011456090>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(tracks.currentPage === tracks.data.length);

    const row = new ActionRowBuilder().addComponents(previous, next);

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Gato Cola - Pag. 1')
                .setDescription(message)
                .setColor(embedOptions.colors.default)
        ],
        components: [row]
    });
};

module.exports = {
    data,
    execute
};
