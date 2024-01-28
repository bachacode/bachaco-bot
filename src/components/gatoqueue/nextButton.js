import { ButtonBuilder, ButtonStyle } from 'discord.js';

const nextButton = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('next')
        .setLabel('palante')
        .setEmoji('<:dwayne:1050074917011456090>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default nextButton;
