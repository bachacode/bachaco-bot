const { ButtonBuilder, ButtonStyle } = require('discord.js');

const refreshButton = () => {
    return new ButtonBuilder()
        .setCustomId('refresh')
        .setLabel('refrescar')
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Secondary);
};
module.exports = refreshButton;
