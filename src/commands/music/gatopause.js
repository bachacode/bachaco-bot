const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('gatopause').setDescription('Replies with GatoPong!'),
  async execute(interaction) {
    await interaction.reply('GatoPong!');
  }
};
