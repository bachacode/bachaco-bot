import { SlashCommandBuilder } from 'discord.js';
import { gatoSaveData, gatoSaveExecute } from './gatosave.subcommand.js';
import { gatoListData, gatoListExecute } from './gatolist.subcommand.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoplaylist')
    .setDescription('Funciones de playlists personalizadas')
    .addSubcommand(gatoSaveData)
    .addSubcommand(gatoListData);

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    if (interaction.options.getSubcommand() === 'save') {
        gatoSaveExecute(interaction);
    } else if (interaction.options.getSubcommand() === 'list') {
        gatoListExecute(interaction);
    }
};
