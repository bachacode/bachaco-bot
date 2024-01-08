const { SlashCommandBuilder } = require('discord.js');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder().setName('gatoexit').setDescription('Saca al bot del canal');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    await interaction.reply('GatoPong!');
};

module.exports = {
    data,
    execute
};
