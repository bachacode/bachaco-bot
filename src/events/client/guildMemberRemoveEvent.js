const { GuildMember, PartialGuildMember, EmbedBuilder } = require('discord.js');
const { getRandomInt } = require('../../helpers/getRandomInt');

/**
 *
 * @param {GuildMember|PartialGuildMember} member
 */
const guildMemberRemoveEvent = async (member) => {
    let channel = member.client.channels.cache.get('603201649099669526');
    let { user } = member;

    let name = `<@${user.id}>`;
    let rand = getRandomInt(2);
    let embed = new EmbedBuilder();
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
