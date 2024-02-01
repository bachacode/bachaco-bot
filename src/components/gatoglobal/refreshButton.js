import { ButtonBuilder, ButtonStyle } from 'discord.js';

const refreshButtonGlobal = () => {
    return new ButtonBuilder()
        .setCustomId('refresh-global')
        .setLabel('refrescar')
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Secondary);
};
export default refreshButtonGlobal;
