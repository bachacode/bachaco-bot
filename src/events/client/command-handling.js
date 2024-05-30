// const { useMainPlayer, useQueue } = require('discord-player');
import { useQueue } from 'discord-player';

import { Events, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import paginate from '../../helpers/paginate.js';
import embedOptions from '../../config/embedOptions.js';
import previousButton from '../../components/gatoqueue/previousButton.js';
import nextButton from '../../components/gatoqueue/nextButton.js';
import { getQueueMessage } from '../../commands/music/gatoqueue.js';
import refreshButton from '../../components/gatoqueue/refreshButton.js';
import { useDatabase } from '../../classes/Database.js';
import { getGlobalMessage } from '../../commands/music/global/gatolist.subcommand.js';
import previousButtonGlobal from '../../components/gatoglobal/previousButton.js';
import nextButtonGlobal from '../../components/gatoglobal/nextButton.js';
import refreshButtonGlobal from '../../components/gatoglobal/refreshButton.js';

/**
 * A Discord Slash Command
 *
 * @typedef {{
 * data: SlashCommandBuilder,
 * execute: (interaction: ChatInputCommandInteraction) => Promise<void>
 * }} SlashCommand
 */

/** @typedef {import('discord.js').Interaction} Interaction */
/** @typedef {import('discord.js').ButtonInteraction} ButtonInteraction */

/**
 *
 * @param {ButtonInteraction} interaction
 * @returns {Promise<Message<boolean>>}
 */
const handleQueueButtonInteraction = (interaction) => {
    const queue = useQueue(interaction.guild.id);

    if (!queue) return interaction.reply('No hay nada sonando elmio.');
    if (queue.tracks.toArray() === 0) return interaction.reply('No hay canciones en cola');

    const currentTrack = queue.currentTrack;
    const tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
    const oldPage = interaction.message.embeds[0].title.match(/Pag\. (\d+)/)[1];
    let contentMsg = '';
    // Check direction
    if (interaction.customId === 'previous') {
        tracks.goToPage(oldPage - 1 - 1);
    } else if (interaction.customId === 'next') {
        tracks.goToPage(oldPage - 1 + 1);
    } else if (interaction.customId === 'refresh') {
        contentMsg = '¡Se ha actualizado la cola!';
    }

    const page = tracks.getCurrentPageData();

    const message = getQueueMessage(page, currentTrack, tracks.currentPage);

    const embedTitle = `Gato Cola - Pag. ${tracks.currentPage + 1}`;

    const previous = previousButton(tracks.currentPage === 0);
    const next = nextButton(tracks.currentPage === tracks.data.length - 1);
    const refresh = refreshButton();
    const row = new ActionRowBuilder().addComponents(previous, next, refresh);

    return interaction.update({
        content: contentMsg,
        embeds: [
            new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(message)
                .setColor(embedOptions.colors.default)
        ],
        components: [row]
    });
};

/**
 *
 * @param {ButtonInteraction} interaction
 * @returns {Promise<Message<boolean>>}
 */
const handleGlobalButtonInteraction = async (interaction) => {
    const db = useDatabase();
    const oldPage = parseInt(interaction.message.embeds[0].title.match(/Pag\. (\d+)/)[1]);
    const pageSize = 10;
    let contentMsg = '';
    let pageNumber = oldPage;
    if (interaction.customId === 'previous-global') {
        pageNumber = oldPage - 1;
    } else if (interaction.customId === 'next-global') {
        pageNumber = oldPage + 1;
    } else if (interaction.customId === 'refresh-global') {
        contentMsg = '¡Se ha actualizado la cola!';
    }

    const globalPlaylist = await db.playlist.aggregate([
        { $match: { id: 'global' } },
        { $limit: 1 },
        {
            $project: {
                _id: 0,
                name: 1,
                url: 1,
                totalPages: { $ceil: { $divide: [{ $size: '$tracks' }, pageSize] } },
                paginatedTracks: { $slice: ['$tracks', (pageNumber - 1) * pageSize, pageSize] }
            }
        }
    ]);

    const message = getGlobalMessage(globalPlaylist[0].paginatedTracks, pageNumber);

    const embedTitle = `Gato Global - Pag. ${pageNumber}`;

    const previous = previousButtonGlobal(pageNumber === 1);
    const next = nextButtonGlobal(pageNumber === globalPlaylist[0].totalPages);
    const refresh = refreshButtonGlobal();
    const row = new ActionRowBuilder().addComponents(previous, next, refresh);

    return interaction.update({
        content: contentMsg,
        embeds: [
            new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(message)
                .setColor(embedOptions.colors.default)
        ],
        components: [row]
    });
};

/**
 *
 * @param {Interaction} interaction
 * @returns {void}
 */
export const execute = async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const client = interaction.client;
        /**
         * @type {SlashCommand}
         */
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            await interaction.reply({
                content: `¡El comando **${interaction.commandName}** no existe!`,
                ephemeral: true
            });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            client.logger.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: '¡Ha ocurrido un error ejecutando el comando!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '¡Ha ocurrido un error ejecutando el comando!',
                    ephemeral: true
                });
            }
        }
    } else if (interaction.isButton()) {
        // Queue button interactions
        if (
            interaction.customId === 'previous' ||
            interaction.customId === 'next' ||
            interaction.customId === 'refresh'
        ) {
            handleQueueButtonInteraction(interaction);
        } else if (
            interaction.customId === 'previous-global' ||
            interaction.customId === 'next-global' ||
            interaction.customId === 'refresh-global'
        ) {
            await handleGlobalButtonInteraction(interaction);
        }
    }
};

export const type = Events.InteractionCreate;
export const once = false;
