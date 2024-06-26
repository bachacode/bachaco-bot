import { EmbedBuilder, Events } from 'discord.js';
/** @typedef {import('discord.js').GuildMember} GuildMember */
/**
 *
 * @param {GuildMember} member
 */
export const execute = async (member) => {
    const channel = member.client.channels.cache.get('603201649099669526');
    const { user } = member;

    try {
        await member.roles.add('603340605774626871');

        if (user.username === 'juanino') {
            await member.roles.add('790794761119203388');
        }

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
    } catch (error) {
        member.client.logger.error(error);

        channel.send({
            content: `Ha ocurrido un error al agregarle el rol al usuario ${member.nickname}`
        });
    }
};

export const type = Events.GuildMemberAdd;
export const once = false;
