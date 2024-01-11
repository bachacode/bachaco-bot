// const { useMainPlayer, useQueue } = require('discord-player');
const { useQueue } = require('discord-player');
const { Events, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const paginate = require('../../helpers/paginate');
const embedOptions = require('../../config/embedOptions');
const previousButton = require('../../components/gatoqueue/previousButton');
const nextButton = require('../../components/gatoqueue/nextButton');
const { getQueueMessage } = require('../../commands/music/gatoqueue');
const refreshButton = require('../../components/gatoqueue/refreshButton');

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
 * @param {Interaction} interaction
 * @returns {void}
 */
const execute = async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const client = interaction.client;
        /**
         * @type {import('../../types').SlashCommand}
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
        }
    }
};

module.exports = {
    type: Events.InteractionCreate,
    once: false,
    execute
};
