import { EmbedBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoMoveData = (subcommand) => {
    return subcommand
        .setName('move')
        .setDescription('Intercambia la posición de dos canciones en la playlist global')
        .addNumberOption((option) => {
            return option
                .setName('position')
                .setDescription('Posición de la canción')
                .setRequired(true);
        })
        .addNumberOption((option) => {
            return option
                .setName('new')
                .setDescription('Nueva posición a la que mover la canción')
                .setRequired(true);
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoMoveExecute = async (interaction) => {
    const db = useDatabase();
    let reply;

    // Limpia el query
    let position = interaction.options.getNumber('position', true) - 1;
    let newPos = interaction.options.getNumber('new', true) - 1;

    if (position < 0 || newPos < 0) {
        return interaction.reply('Las posiciones dadas tienen que ser mayor 0');
    } else if (position === newPos) {
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

        if (position >= queueLength) {
            position = queueLength - 1;
        }

        if (newPos >= queueLength) {
            newPos = queueLength - 1;
        }

        const track = globalPlaylist.tracks[position];
        globalPlaylist.tracks.splice(position, 1);
        globalPlaylist.tracks.splice(newPos, 0, track);
        await globalPlaylist.save();

        reply = {
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `Se ha movido **${track.title}** de la posición \`${
                            position + 1
                        }\`a la posición \`${newPos + 1}\` de la playlist global.`
                    )
                    .setThumbnail(track.thumbnail)
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
