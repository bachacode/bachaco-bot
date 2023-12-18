const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gatoresume')
        .setDescription('gatoc reanuda la canción actual.'),
    async execute(interaction) {
        // Revisa si hay una queue activa.
        const queue = useQueue(interaction.guild.id);

        const embed = new EmbedBuilder().setColor('DarkAqua');

        if (!queue) return interaction.reply('No hay nada sonando elmio.');

        if (!queue.node.isPaused()) {
            return interaction.reply({
                embeds: [embed.setDescription('¡gatoc no esta pausado!')]
            });
        }
        queue.node.setPaused(false);

        await interaction.reply({
            embeds: [embed.setDescription('¡gatoc ha reanudado la cancion!')]
        });
    }
};
