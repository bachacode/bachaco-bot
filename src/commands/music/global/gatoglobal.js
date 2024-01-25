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
const { gatoFirstExecute, gatoFirstData } = require('./gatofirst.subcommand');

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
    .addSubcommand(gatoInsertData)
    .addSubcommand(gatoFirstData);

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    /*
    eslint indent: [2, 4, {"SwitchCase": 1}]
    */
    switch (interaction.options.getSubcommand()) {
        case 'add':
            gatoSaveExecute(interaction);
            break;
        case 'list':
            gatoListExecute(interaction);
            break;
        case 'play':
            gatoPlayExecute(interaction);
            break;
        case 'remove':
            gatoRemoveExecute(interaction);
            break;
        case 'randomlocke':
            gatoRandomExecute(interaction);
            break;
        case 'insert':
            gatoInsertExecute(interaction);
            break;
        case 'first':
            gatoFirstExecute(interaction);
            break;
        default:
            await interaction.reply('No se ha encontrado ese subcomando');
    }
};

module.exports = {
    data,
    execute
};
