import { EmbedBuilder } from 'discord.js';
import embedOptions from '../../../config/embedOptions.js';
import { useDatabase } from '../../../classes/Database.js';

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
export const gatoRemoveData = (subcommand) => {
    return subcommand
        .setName('remove')
        .setDescription('Quita una canción de la playlist global')
        .addNumberOption((option) => {
            return option
                .setName('position')
                .setDescription('Posición de la canción en la playlist')
                .setRequired(true);
        });
};

/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {GuildQueue} queue
 */
export const gatoRemoveExecute = async (interaction) => {
    const db = useDatabase();
    let trackNumber = interaction.options.getNumber('position', true) - 1;
    if (trackNumber < 0) return await interaction.reply('La posición tiene que ser 1 o superior');
    await interaction.deferReply();

    const globalPlaylist = await db.playlist.findOne({ id: 'global' }).catch((err) => {
        console.log(err);
        return interaction.editReply('error al buscar la playlist');
    });

    if (trackNumber >= globalPlaylist.tracks.length) {
        trackNumber = globalPlaylist.tracks.length - 1;
    }

    const track = globalPlaylist.tracks.splice(trackNumber, 1)[0];
    await globalPlaylist.save();

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`Se ha removido **${track.title}** de la cola`)
                .setThumbnail(track.thumbnail)
                .setColor(embedOptions.colors.default)
        ]
    });
};
