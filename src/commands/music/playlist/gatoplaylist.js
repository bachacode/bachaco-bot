const { SlashCommandBuilder } = require('discord.js');
const { gatoSaveData, gatoSaveExecute } = require('./gatosave.subcommand');
const { gatoListData, gatoListExecute } = require('./gatolist.subcommand');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoplaylist')
    .setDescription('Funciones de playlists personalizadas')
    .addSubcommand(gatoSaveData)
    .addSubcommand(gatoListData);

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    if (interaction.options.getSubcommand() === 'save') {
        gatoSaveExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'list') {
        gatoListExecute(interaction);
    }
};

module.exports = {
    data,
    execute
};
