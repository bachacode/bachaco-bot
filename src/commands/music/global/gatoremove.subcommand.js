const { EmbedBuilder } = require('discord.js');
const embedOptions = require('../../../config/embedOptions');
const { useDatabase } = require('../../../classes/Database');

/** @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction */
/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord.js').SlashCommandSubcommandBuilder} Subcommand */

/** @param {Subcommand} subcommand */
const gatoRemoveData = (subcommand) => {
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
const gatoRemoveExecute = async (interaction) => {
    const db = useDatabase();
    await interaction.deferReply();

    const globalPlaylist = await db.playlist.findOne({ id: 'global' }).catch((err) => {
        console.log(err);
        return interaction.editReply('error al buscar la playlist');
    });

    const trackNumber = interaction.options.getNumber('position', true) - 1;
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

module.exports.gatoRemoveData = gatoRemoveData;
module.exports.gatoRemoveExecute = gatoRemoveExecute;
