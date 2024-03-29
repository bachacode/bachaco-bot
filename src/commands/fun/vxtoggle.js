import { SlashCommandBuilder } from 'discord.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('vxtoggle')
    .setDescription('Activa o desactiva el vx automatico');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const client = interaction.client;
    client.vxPrefix = !client.vxPrefix;
    if (client.vxPrefix === true) {
        await interaction.reply('El vx esta activado');
    } else {
        await interaction.reply('El vx esta desactivado');
    }
};
