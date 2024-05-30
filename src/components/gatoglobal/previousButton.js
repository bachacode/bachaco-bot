import { ButtonBuilder, ButtonStyle } from 'discord.js';

const previousButtonGlobal = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('previous-global')
        .setLabel('patra')
        .setEmoji('<:sadcheems:869742943425151087>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default previousButtonGlobal;
