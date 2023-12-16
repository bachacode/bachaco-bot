const { EmbedBuilder } = require('discord.js');
const { getRandomInt } = require('../../helpers/getRandomInt');
/** @typedef {import('discord.js').GuildMember} GuildMember */
/** @typedef {import('discord.js').PartialGuildMember} PartialGuildMember */
/**
 *
 * @param {GuildMember|PartialGuildMember} member
 */
const guildMemberRemoveEvent = async (member) => {
    const channel = member.client.channels.cache.get('603201649099669526');
    const { user } = member;

    const name = `<@${user.id}>`;
    const rand = getRandomInt(2);
    const embed = new EmbedBuilder();
    if (rand === 1) {
        embed
            .setColor('Aqua')
            .setTitle('c lo acomodaron por las costillas <:sadcheems:869742943425151087>')
            .setImage('https://media.tenor.com/ww56Kix_vM8AAAAC/seloacomodoporlascostillas.gif')
            .setDescription(`${name} no aguanto la pela.`);
    } else if (rand === 0) {
        embed
            .setColor('Aqua')
            .setTitle('c le fue la luz <:sadcheems:869742943425151087>')
            .setImage('https://media.tenor.com/vHMD9o7RmfYAAAAC/snake-salute.gif')
            .setDescription(`${name} no aguanto la pela.`);
    }

    channel.send({
        embeds: [embed]
    });
};

module.exports = guildMemberRemoveEvent;
