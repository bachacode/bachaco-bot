import { ButtonBuilder, ButtonStyle } from 'discord.js';

const fullPreviousButtonGlobal = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('full-previous-global')
        .setEmoji('⏪')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default fullPreviousButtonGlobal;
