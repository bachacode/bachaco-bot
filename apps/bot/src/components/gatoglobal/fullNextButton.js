import { ButtonBuilder, ButtonStyle } from 'discord.js';

const fullNextButtonGlobal = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('full-next-global')
        .setEmoji('⏩')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default fullNextButtonGlobal;
