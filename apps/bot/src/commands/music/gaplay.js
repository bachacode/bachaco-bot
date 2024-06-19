import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useMainPlayer, useQueue } from 'discord-player';
import getQueryData from '../../helpers/getQueryData.js';
import playerOptions from '../../config/playerOptions.js';
import embedOptions from '../../config/embedOptions.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
export const data = new SlashCommandBuilder()
    .setName('gaplay')
    .setDescription('gatoc reproduce una canción.')
    .addStringOption((option) =>
        option.setName('query').setDescription('la URL de la canción.').setRequired(true)
    );

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
    const player = useMainPlayer();

    // Revisa si el usuario esta conectado a un canal de voz.
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('No estas conectado a un canal de voz.');
    if (!channel.joinable) return interaction.reply('No puedo unirme a ese canal de voz.');

    // Revisa si ya hay un bot conectado a otro canal.
    const queue = useQueue(interaction.guild.id);
    if (queue && queue.channel !== channel) {
        return interaction.reply('Ya estoy en otro canal de voz.');
    }

    // Limpia el query
    const { url, queryIndex } = getQueryData(interaction.options.getString('query', true));

    await interaction.deferReply();

    const result = await player.search(url);
    // Si tiene index coloca de primero la canción del index
    if (result.tracks.length > 0 && url.includes('?list=') && queryIndex != null) {
        for (let i = 0; i < queryIndex - 1; i++) {
            result.tracks.shift();
        }
    }

    // Guard Statements
    if (!result?.tracks.length && url.includes('?list=')) {
        return interaction.editReply('¡No se pueden reproducir mix generados por youtube 💀💀💀');
    }

    if (result.playlist == null && result.tracks[0].metadata.nsfw) {
        return interaction.editReply('La canción es NSFW 💀💀💀');
    }

    if (!result?.tracks.length) {
        return interaction.editReply('No se encontró la canción 💀💀💀.');
    }
    try {
        await player.play(channel, result, {
            nodeOptions: {
                ...playerOptions,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                }
            }
        });

        if (result.playlist == null) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Enlace a la canción')
                        .setURL(result.tracks[0].url)
                        .setDescription(
                            `🎶 | Se ha puesto **${result.tracks[0].title}** en la cola.`
                        )
                        .setThumbnail(result.tracks[0].thumbnail)
                        .setColor(embedOptions.colors.default)
                ]
            });
        } else {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Enlace a la playlist')
                        .setURL(result.playlist.url)
                        .setDescription(
                            `🎶 | Se ha puesto la playlist **${result.playlist.title}**.`
                        )
                        .setThumbnail(result.tracks[0].thumbnail)
                        .setColor(embedOptions.colors.default)
                ]
            });
        }
    } catch (error) {
        player.logger.error(error);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('¡Ha ocurrido un error al poner la canción!')
                    .setColor(embedOptions.colors.error)
            ]
        });
    }
};
