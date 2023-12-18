const { SlashCommandBuilder } = require('discord.js');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder().setName('gatoping').setDescription('Replies with GatoPong!');

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
