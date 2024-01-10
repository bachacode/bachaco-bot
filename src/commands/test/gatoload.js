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
    const commandFolders = fs.readdirSync(foldersPath);
    let commandFile = `${command.data.name}.js`;
    let found = false;
    // Look on all subfolders in command for the command provided
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        // Check if a file
        for (const file of commandFiles) {
            if (file !== commandFile) continue;
            commandFile = path.join(commandsPath, file);
            found = true;
        }
    }

    if (!found) {
        return interaction.reply(
            `Ha ocurrido un error encontrando el archivo del comando:  \`${commandName}\`!`
        );
    }

    delete require.cache[require.resolve(commandFile)];

    try {
        interaction.client.commands.delete(command.data.name);
        const newCommand = require(commandFile);
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
