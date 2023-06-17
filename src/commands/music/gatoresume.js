const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder().setName('gatoresume').setDescription('Replies with GatoPong!'),
  async execute (interaction) {
    await interaction.reply('GatoPong!')
  }
}
