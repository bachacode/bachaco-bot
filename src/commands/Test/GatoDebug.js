const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gatodebug')
    .setDescription('debugea al gatoc.'),
  async execute ({ interaction }) {
  let { user } = interaction.member;

  let name = `<@${user.id}>`;

  let embed = new EmbedBuilder()
    .setColor('Aqua')
    .setImage('https://tenor.com/bAGSx.gif')
    .setTitle('c le fue la luz <:sadcheems:869742943425151087>')
    .setDescription(`${name} no aguanto la pela.`)
    interaction.channel.send({
      embeds:[ 
        embed
      ]
    });
  }
};
