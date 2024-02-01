import { EmbedBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoSwapData = (subcommand) => {
    return subcommand
        .setName('swap')
        .setDescription('Intercambia la posición de dos canciones en la playlist global')
        .addNumberOption((option) => {
            return option
                .setName('first')
                .setDescription('Posición de la canción')
                .setRequired(true);
        })
        .addNumberOption((option) => {
            return option
                .setName('second')
                .setDescription('Posición de la segunda canción')
                .setRequired(true);
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoSwapExecute = async (interaction) => {
    const db = useDatabase();
    let reply;

    // Limpia el query
    let first = interaction.options.getNumber('first', true) - 1;
    let second = interaction.options.getNumber('second', true) - 1;

    if (first < 0 || second < 0) {
        return interaction.reply('Las posiciones dadas tienen que ser mayor 0');
    } else if (first === second) {
        return interaction.reply('No puedes intercambiar una canción consigo misma');
    }

    await interaction.deferReply();

    try {
        let globalPlaylist = await db.playlist.findOne({ id: 'global' });

        if (globalPlaylist == null) {
            globalPlaylist = await db.playlist.create({
                id: 'global',
                name: 'Playlist Global'
            });
        }

        const queueLength = globalPlaylist.tracks.length;

        if (first >= queueLength) {
            first = queueLength - 1;
        }

        if (second >= queueLength) {
            second = queueLength - 1;
        }

        const track = globalPlaylist.tracks[first];
        const secondTrack = globalPlaylist.tracks[second];
        globalPlaylist.tracks.splice(first, 1, secondTrack);
        globalPlaylist.tracks.splice(second, 1, track);
        await globalPlaylist.save();

        reply = {
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `Se ha movido **${track.title}** a la posición ${second + 1} de la cola.`
                    )
                    .setThumbnail(track.thumbnail)
                    .setColor(embedOptions.colors.default),
                new EmbedBuilder()
                    .setDescription(
                        `Se ha movido **${secondTrack.title}** a la posición ${
                            first + 1
                        } de la cola.`
                    )
                    .setThumbnail(secondTrack.thumbnail)
                    .setColor(embedOptions.colors.default)
            ]
        };
    } catch (error) {
        console.log(error);
        reply = {
            embeds: [
                new EmbedBuilder()
                    .setTitle('Ha ocurrido un error')
                    .setDescription(
                        'Ha ocurrido un error inesperado, revise la consola para solucionarlo'
                    )
                    .setColor(embedOptions.colors.default)
            ],
            ephemeral: true
        };

        if (interaction.deferred) {
            return await interaction.editReply(reply);
        } else {
            return await interaction.reply(reply);
        }
    }

    if (interaction.deferred) {
        return await interaction.editReply(reply);
    } else {
        return await interaction.reply(reply);
    }
};
