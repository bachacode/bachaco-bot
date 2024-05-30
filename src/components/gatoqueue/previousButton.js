import { ButtonBuilder, ButtonStyle } from 'discord.js';

const previousButton = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('patra')
        .setEmoji('<:sadcheems:869742943425151087>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default previousButton;
