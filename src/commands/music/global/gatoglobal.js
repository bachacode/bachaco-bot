const { SlashCommandBuilder } = require('discord.js');
const { gatoSaveData, gatoSaveExecute } = require('./gatoadd.subcommand');
const { gatoListData, gatoListExecute } = require('./gatolist.subcommand');
const {
    gatoPlayData,
    gatoPlayExecute,
    gatoRandomExecute,
    gatoRandomData
} = require('./gatoplay.subcommand');
const { gatoRemoveData, gatoRemoveExecute } = require('./gatoremove.subcommand');
const { gatoInsertData, gatoInsertExecute } = require('./gatoinsert.subcommand');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoglobal')
    .setDescription('Playlist global que todo el mundo puede editar')
    .addSubcommand(gatoSaveData)
    .addSubcommand(gatoListData)
    .addSubcommand(gatoPlayData)
    .addSubcommand(gatoRemoveData)
    .addSubcommand(gatoRandomData)
    .addSubcommand(gatoInsertData);

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    if (interaction.options.getSubcommand() === 'add') {
        gatoSaveExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'list') {
        gatoListExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'play') {
        gatoPlayExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'remove') {
        gatoRemoveExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'randomlocke') {
        gatoRandomExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'insert') {
        gatoInsertExecute(interaction);
    }
};

module.exports = {
    data,
    execute
};
