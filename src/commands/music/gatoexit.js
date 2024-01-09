const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder().setName('gatoexit').setDescription('Saca al bot del canal');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    queue.delete();

    await interaction.reply('<:sadcheems:869742943425151087>');
};

module.exports = {
    data,
    execute
};
