import { SlashCommandBuilder } from 'discord.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoerror')
    .setDescription('Throws an error for testing')
    .addStringOption((option) =>
        option.setName('error').setDescription('Error message').setRequired(true)
    );

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const errorMessage = interaction.options.getString('error', true);

    await Promise.reject(new Error(errorMessage));

    interaction.client.logger.info('siguio corriendo');
};
