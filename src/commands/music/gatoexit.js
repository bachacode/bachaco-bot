const { SlashCommandBuilder } = require('discord.js');
/**
 * Descripción de la variable const.
 * @type {tipo}
 */
module.exports = {
    data: new SlashCommandBuilder().setName('gatoexit').setDescription('Replies with GatoPong!'),
    async execute(interaction) {
        await interaction.reply('GatoPong!');
    }
};
