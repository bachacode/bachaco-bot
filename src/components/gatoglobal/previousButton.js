import { ButtonBuilder, ButtonStyle } from 'discord.js';

const previousButtonGlobal = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('previous-global')
        .setLabel('patra')
        .setEmoji('<:miau:800244696349802537>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default previousButtonGlobal;
