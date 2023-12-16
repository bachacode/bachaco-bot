const { GuildMember, EmbedBuilder } = require('discord.js');

/**
 *
 * @param {GuildMember} member
 */
const GuildMemberAddEvent = async (member) => {
    const channel = member.client.channels.cache.get('603201649099669526');
    const { user } = member;
    member.roles.add('603340605774626871');
    const name = `<@${user.id}>`;
    const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setTitle('qlq <:gatoC:957421664738639872> 🍷')
        .setImage('https://media.tenor.com/eH-RoS91Q1gAAAAC/cat.gif')
        .setDescription(
            `${name} acaba de cometer el error mas grande de su vida entrando a esta tierra profana.`
        );
    channel.send({
        embeds: [embed]
    });
};

module.exports = GuildMemberAddEvent;
