import { ButtonBuilder, ButtonStyle } from 'discord.js';

const fullPreviousButton = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('full-previous')
        .setEmoji('⏪')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default fullPreviousButton;
