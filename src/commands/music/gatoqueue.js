const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { paginate } = require('../../helpers/paginate');
module.exports = {
    data: new SlashCommandBuilder().setName('gatoqueue').setDescription('Replies with GatoPong!'),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        const currentTrack = queue.currentTrack;
        const tracks = paginate(queue.tracks.toArray(), 10); // Converts the queue into a array of tracks
        let message = '';

        message += `**[0]** ${currentTrack.title}\n`;
        for (let index = 0; index < 10; index++) {
            message += `**[${index + 1}]** ${tracks.data[0][index].title}\n`;
        }

        const embeddedMessage = {
            embeds: [new EmbedBuilder().setTitle('Gato Cola').setDescription(message)]
        };

        await interaction.reply(embeddedMessage);
        const messageSent = await interaction.fetchReply();
        await messageSent.react('<:gatoC:957421664738639872>');
        await messageSent.react('<:tobi:716441157458198579>');
    }
};
