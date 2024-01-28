import { ButtonBuilder, ButtonStyle } from 'discord.js';

const previousButton = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('patra')
        .setEmoji('<:miau:800244696349802537>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default previousButton;
