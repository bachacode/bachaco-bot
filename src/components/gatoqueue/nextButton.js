const { ButtonBuilder, ButtonStyle } = require('discord.js');

const nextButton = (disabled) => {
    return new ButtonBuilder()
        .setCustomId('next')
        .setLabel('palante')
        .setEmoji('<:dwayne:1050074917011456090>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
};
module.exports = nextButton;
