import { useQueue } from 'discord-player';
import { SlashCommandBuilder } from 'discord.js';
/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gatoexit')
    .setDescription('Saca al bot del canal');

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) return await interaction.reply('No hay nada sonando elmio.');

    queue.delete();

    await interaction.reply('<:sadcheems:869742943425151087>');
};
