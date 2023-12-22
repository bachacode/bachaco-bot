const { Events } = require('discord.js');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @returns {void}
 */
const execute = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    /**
     * @type {import('../../types').SlashCommand}
     */
    const command = interaction.client.commands.get(interaction.commandName);

    const client = interaction.client;

    if (!command) {
        await interaction.followUp({
            content: '¡El comando no existe!',
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
};

module.exports = {
    type: Events.InteractionCreate,
    once: false,
    execute
};
