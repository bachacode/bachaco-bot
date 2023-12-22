const { SlashCommandBuilder } = require('discord.js');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoping')
    .setDescription('Responde con los milisegundos de respuesta');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const clientLatency = interaction.client.ws.ping.toFixed(0);

    await interaction.reply(`:ping_pong: GatoPong! en ${clientLatency}ms`);
};

module.exports = {
    data,
    execute
};
