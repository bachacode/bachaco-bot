const { ButtonBuilder, ButtonStyle } = require('discord.js');

const refreshButtonGlobal = () => {
    return new ButtonBuilder()
        .setCustomId('refresh-global')
        .setLabel('refrescar')
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Secondary);
};
module.exports = refreshButtonGlobal;
