const { useQueue } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embedOptions = require('../../config/embedOptions');
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder().setName('gatoexit').setDescription('Saca al bot del canal');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) return interaction.reply('No hay nada sonando elmio.');

    queue.delete();

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription('<:sadcheems:869742943425151087>')
                .setColor(embedOptions.colors.default)
        ]
    });
};

module.exports = {
    data,
    execute
};
