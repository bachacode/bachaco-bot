const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vxtoggle')
        .setDescription('Activa o desactiva el vx automatico'),
    async execute(interaction) {
        const client = interaction.client;
        client.vxPrefix = !client.vxPrefix;
        if (client.vxPrefix === true) {
            await interaction.reply('El vx esta activado');
        } else {
            await interaction.reply('El vx esta desactivado');
        }
    }
};
