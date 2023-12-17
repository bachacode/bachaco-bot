/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @returns
 */
const commandHandlingEvent = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Check if the command exists and run it if so
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`El comando ${interaction.commandName} no existe.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
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

module.exports = commandHandlingEvent;
