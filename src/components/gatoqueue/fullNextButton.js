import { ButtonBuilder, ButtonStyle } from 'discord.js';

const fullNextButton = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('full-next')
        .setEmoji('⏩')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default fullNextButton;
