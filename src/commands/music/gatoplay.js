const { SlashCommandBuilder, ChannelType } = require('discord.js')
const { createAudioPlayer } = require('@discordjs/voice')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('gatojoin')
    .setDescription('Makes the bot join your current voice!')
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('The channel to join')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildVoice)
    ).toJSON(),
  async execute (interaction) {
    const voiceChannel = interaction.options.getChannel('channel')
    const voiceConnection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    })
    voiceConnection
  }
}
