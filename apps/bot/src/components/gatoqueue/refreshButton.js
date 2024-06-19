import { ButtonBuilder, ButtonStyle } from 'discord.js';

const refreshButton = () => {
    return new ButtonBuilder()
        .setCustomId('refresh')
        .setEmoji('🔄')
        .setStyle(ButtonStyle.Secondary);
};
export default refreshButton;
