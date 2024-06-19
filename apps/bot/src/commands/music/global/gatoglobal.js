import { SlashCommandBuilder } from 'discord.js';
import { gatoSaveData, gatoSaveExecute } from './gatoadd.subcommand.js';
import { gatoListData, gatoListExecute } from './gatolist.subcommand.js';
import {
    gatoPlayData,
    gatoPlayExecute,
    gatoRandomExecute,
    gatoRandomData
} from './gatoplay.subcommand.js';
import { gatoRemoveData, gatoRemoveExecute } from './gatoremove.subcommand.js';
import { gatoInsertData, gatoInsertExecute } from './gatoinsert.subcommand.js';
import { gatoFirstExecute, gatoFirstData } from './gatofirst.subcommand.js';
import { gatoSwapData, gatoSwapExecute } from './gatoswap.subcommand.js';
import { gatoMoveData, gatoMoveExecute } from './gatomove.subcommand.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoglobal')
    .setDescription('Playlist global que todo el mundo puede editar')
    .addSubcommand(gatoSaveData)
    .addSubcommand(gatoListData)
    .addSubcommand(gatoPlayData)
    .addSubcommand(gatoRemoveData)
    .addSubcommand(gatoRandomData)
    .addSubcommand(gatoInsertData)
    .addSubcommand(gatoFirstData)
    .addSubcommand(gatoSwapData)
    .addSubcommand(gatoMoveData);

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
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
        case 'swap':
            gatoSwapExecute(interaction);
            break;
        case 'move':
            gatoMoveExecute(interaction);
            break;
        default:
            await interaction.reply('No se ha encontrado ese subcomando');
    }
};
