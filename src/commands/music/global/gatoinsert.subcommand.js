import { EmbedBuilder } from 'discord.js';
import { serialize, useMainPlayer, useQueue } from 'discord-player';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';
import getQueryData from '../../../helpers/getQueryData.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoInsertData = (subcommand) => {
    return subcommand
        .setName('insert')
        .setDescription('Añade una canción en la playlist global en una posición especifica')
        .addStringOption((option) => {
            return option.setName('query').setDescription('Enlace de la canción').setRequired(true);
        })
        .addNumberOption((option) => {
            return option
                .setName('position')
                .setDescription('Posición de la cola a insertar la canción')
                .setRequired(true);
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoInsertExecute = async (interaction) => {
    const player = useMainPlayer();
    const db = useDatabase();
    const queue = useQueue(interaction.guild.id);
    let reply;

    // Limpia el query
    const { url, queryIndex } = getQueryData(interaction.options.getString('query', true));
    let position = interaction.options.getNumber('position', true);
    await interaction.deferReply();

    try {
        let globalPlaylist = await db.playlist.findOne({ id: 'global' });
        const result = await player.search(url);
        // Si tiene index coloca de primero la canción del index
        if (result.tracks.length > 0 && url.includes('?list=') && queryIndex != null) {
            for (let i = 0; i < queryIndex - 1; i++) {
                result.tracks.shift();
            }
        }

        if (result.tracks[0].metadata.nsfw) {
            return interaction.editReply('No se pueden guardar canciones NSFW 💀💀💀');
        }

        if (globalPlaylist == null) {
            globalPlaylist = await db.playlist.create({
                id: 'global',
                name: 'Playlist Global'
            });
        }

        const track = serialize(result.tracks[0]);

        if (globalPlaylist.tracks.some((zoltraack) => zoltraack.url === track.url)) {
            return interaction.editReply('Esa canción ya existe en la playlist global');
        }
        globalPlaylist.tracks.splice(position - 1, 0, track);

        await globalPlaylist.save();

        if (queue && queue.isPlaying) {
            const queueLength = queue.tracks.toArray().length;
            if (position >= queueLength) {
                queue.insertTrack(result.tracks[0], queueLength - 1);
                position = queueLength;
            } else {
                queue.insertTrack(result.tracks[0], position - 1);
            }
        }

        reply = {
            embeds: [
                new EmbedBuilder()
                    .setTitle('Enlace a la canción')
                    .setURL(result.tracks[0].url)
                    .setDescription(
                        `📼 | Se ha guardado **${result.tracks[0].title}** en la posición \`${position}\` de la playlist global`
                    )
                    .setThumbnail(result.tracks[0].thumbnail)
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
