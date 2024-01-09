const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatopause')
    .setDescription('gatoc pausa la canción actual.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);

    const embed = new EmbedBuilder().setColor('DarkAqua');

    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    if (queue.node.isPaused()) {
        return interaction.reply({
            embeds: [embed.setDescription('¡gatoc ya esta pausado!')]
        });
    }
    queue.node.setPaused(true);

    await interaction.reply({
        embeds: [embed.setDescription('¡gatoc ha pausado la canción!')]
    });
};

module.exports = {
    data,
    execute
};
