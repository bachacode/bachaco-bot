require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomInt } = require('../../helpers/getRandomInt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gatodebug')
    .setDescription('debugea al gatoc.'),
  async execute ({ interaction }) {
  let { user } = interaction.member;

  let name = `<@${user.id}>`;

  let rand = getRandomInt(2);
  let embed = new EmbedBuilder();
  if(rand === 1) {
    embed.setColor('Aqua')
    .setTitle('c lo acomodaron por las costillas <:sadcheems:869742943425151087>')
    .setImage('https://media.tenor.com/ww56Kix_vM8AAAAC/seloacomodoporlascostillas.gif')
    .setDescription(`${name} no aguanto la pela.`)
  } else if (rand === 0) {
    embed.setColor('Aqua')
    .setTitle('c le fue la luz <:sadcheems:869742943425151087>')
    .setImage('https://media.tenor.com/vHMD9o7RmfYAAAAC/snake-salute.gif')
    .setDescription(`${name} no aguanto la pela.`)
  }
    interaction.channel.send({
      embeds:[ 
        embed
      ]
    });
  }
};
