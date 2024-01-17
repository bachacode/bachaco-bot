const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */

/** @type {SlashCommandBuilder} */
const data = new SlashCommandBuilder()
    .setName('gatoload')
    .setDescription('Actualiza un comando (para testeo)')
    .addStringOption((option) =>
        option.setName('command').setDescription('The command to reload.').setRequired(true)
    );

const getCommandPath = (directoryPath, commandFile) => {
    const items = fs.readdirSync(directoryPath);
    for (const item of items) {
        const itemPath = path.join(directoryPath, item);
        if (fs.statSync(itemPath).isFile() && item === commandFile) {
            return itemPath;
        } else if (fs.statSync(itemPath).isDirectory()) {
            const path = getCommandPath(itemPath, commandFile);
            if (path) {
                return path;
            }
        }
    }
};

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
    const commandName = interaction.options.getString('command', true).toLowerCase();
    const client = interaction.client;
    const command = client.commands.get(commandName);

    if (!command) {
        return interaction.reply(`No hay ningún comando llamado \`${commandName}\`!`);
    }

    const root = client.root;

    const foldersPath = path.join(root, 'commands');
    const commandFile = `${command.data.name}.js`;
    const commandPath = getCommandPath(foldersPath, commandFile);

    if (!commandPath) {
        return interaction.reply(
            `Ha ocurrido un error encontrando el archivo del comando:  \`${commandName}\`!`
        );
    }

    delete require.cache[require.resolve(commandPath)];

    try {
        interaction.client.commands.delete(command.data.name);
        const newCommand = require(commandPath);
        interaction.client.commands.set(newCommand.data.name, newCommand);
        await interaction.reply(`¡El comando \`${newCommand.data.name}\` ha sido actualizado!`);
    } catch (error) {
        client.logger.error(error);
        await interaction.reply({
            content: `Ha ocurrido actualizando el comando \`${command.data.name}\`:\n\`${error.message}\``,
            ephemeral: true
        });
    }
};

module.exports = {
    data,
    execute
};
