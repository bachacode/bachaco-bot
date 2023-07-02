const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('gatobait').setDescription('Baitea a los causitas!'),
  async execute ({ interaction }) {
    await interaction.channel.send(`**${interaction.user.username}** No aguanto la pela`)
    await setTimeout(async () => {
        await interaction.channel.send('<:tobiarrecho:867985509937467464>');
    }, 1000);
  }
};
