const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatopause')
    .setDescription('gatoc pausa o reanuda la musica.');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    // Revisa si hay una queue activa.
    const queue = useQueue(interaction.guild.id);

    const embed = new EmbedBuilder().setColor('DarkAqua');

    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    // Pausa o reanuda la cola
    queue.node.setPaused(!queue.node.isPaused());
    if (queue.node.isPaused()) {
        return interaction.reply({
            embeds: [embed.setDescription('¡Gatoc ha sido pausado!')]
        });
    } else {
        await interaction.reply({
            embeds: [embed.setDescription('¡Gatoc ha sido reanudado!')]
        });
    }
};

module.exports = {
    data,
    execute
};
