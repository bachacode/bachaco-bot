// const { useMainPlayer, useQueue } = require('discord-player');
const { Events } = require('discord.js');
// const paginate = require('../../helpers/paginate');

/** @typedef {import('discord.js').Interaction} Interaction */
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
        // if (interaction.customId === 'previous') {
        //     console.log('test');
        // } else if (interaction.customId === 'next') {
        //     console.log('next');
        // }
        // const queue = useQueue(interaction.guild.id);
        // if (!queue) return interaction.reply('No hay nada sonando elmio.');
        // if (queue.tracks.toArray() === 0) return interaction.reply('No hay canciones en cola');
        // const currentTrack = queue.currentTrack;
        // const tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
        // let message = '';
        // if (interaction.customId === 'previous') {
        //     tracks.goPreviousPage();
        // } else if (interaction.customId === 'next') {
        //     tracks.goNextPage();
        // }
        // previous.setDisabled(tracks.currentPage === 0);
        // next.setDisabled(tracks.currentPage === tracks.data.length);
        // const page = tracks.data[tracks.currentPage];
        // message = '';
        // for (let index = 0; index < 10; index++) {
        //     const songNumber = (index + 1) * (tracks.currentPage + 1);
        //     if (!page[index]) continue;
        //     message += `**[${songNumber}]** ${page[index].title}\n`;
        // }
        // await pressed.update({
        //     embeds: [new EmbedBuilder().setTitle('Gato Cola').setDescription(message)],
        //     components: [row]
        // });
    }
};

module.exports = {
    type: Events.InteractionCreate,
    once: false,
    execute
};
