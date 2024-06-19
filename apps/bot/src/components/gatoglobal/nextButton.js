import { ButtonBuilder, ButtonStyle } from 'discord.js';

const nextButtonGlobal = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('next-global')
        .setLabel('palante')
        .setEmoji('<:dwayne:1050074917011456090>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
export default nextButtonGlobal;
