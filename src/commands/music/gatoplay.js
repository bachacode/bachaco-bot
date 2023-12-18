const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gaplay')
        .setDescription('gatoc reproduce una canción.')
        .addStringOption((option) =>
            option.setName('query').setDescription('la URL de la canción.').setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();

        // Revisa si el usuario esta conectado a un canal de voz.
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('No estas conectado a un canal de voz.');
        if (!channel.joinable) return interaction.reply('No puedo unirme a ese canal de voz.');

        // Revisa si ya hay un bot conectado a otro canal.
        const queue = useQueue(interaction.guild.id);
        if (queue && queue.channel !== channel) {
            return interaction.reply('Ya estoy en otro canal de voz.');
        }

        let query = interaction.options.getString('query', true);
        let queryIndex = null;
        // Limpia el query
        if (query.includes('&list=') && query.includes('watch?v=')) {
            query = query.replace(/watch\?v=[^&]+/, 'playlist');
            query = query.replace(/playlist&/, 'playlist?');
            if (query.includes('&index=')) {
                queryIndex = query.match(/&index=(\d+)/)[1];
                query = query.replace(/&index=\d+/, '');
            }
        }

        await interaction.deferReply();

        const result = await player.search(query);
        // Si tiene index coloca de primero la canción del index
        if (result.tracks.length > 0 && query.includes('?list=') && queryIndex != null) {
            for (let i = 0; i < queryIndex - 1; i++) {
                result.tracks.shift();
            }
        }

        // Guard Statements
        if (!result?.tracks.length && query.includes('?list=')) {
            return interaction.editReply(
                '¡No se pueden reproducir mix generados por youtube 💀💀💀'
            );
        }
        if (result.playlist == null && result.tracks[0].metadata.nsfw) {
            return interaction.editReply('La canción es NSFW 💀💀💀');
        }
        if (!result?.tracks.length) {
            return interaction.editReply('No se encontró la canción 💀💀💀.');
        }

        try {
            await player.play(channel, result, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        requestedBy: interaction.user
                    },
                    leaveOnEndCooldown: 300000,
                    leaveOnEmptyCooldown: 30000,
                    skipOnNoStream: true
                }
            });

            if (result.playlist == null) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Enlace a la canción')
                            .setURL(result.tracks[0].url)
                            .setDescription(
                                `🎶 | Se ha puesto **${result.tracks[0].title}** en la cola.`
                            )
                            .setThumbnail(result.tracks[0].thumbnail)
                            .setColor('DarkAqua')
                    ]
                });
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Enlace a la playlist')
                            .setURL(result.playlist.url)
                            .setDescription(
                                `🎶 | Se ha puesto la playlist **${result.playlist.title}**.`
                            )
                            .setThumbnail(result.tracks[0].thumbnail)
                            .setColor('DarkAqua')
                    ]
                });
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: '¡Ha ocurrido un error al poner la canción!\n'
            });
        }
    }
};
