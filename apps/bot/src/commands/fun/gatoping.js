import { SlashCommandBuilder } from 'discord.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoping')
    .setDescription('Replies with GatoPong!');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const clientLatency = interaction.client.ws.ping.toFixed(0);
    await interaction.reply(`GatoPong! con ${clientLatency}ms`);
};
