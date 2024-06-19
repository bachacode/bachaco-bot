/** @typedef {import('discord-player').GuildQueue} GuildQueue */
/** @typedef {import('discord-player').Track} Track */

/**
 * @param {GuildQueue} queue
 * @param {Track} track
 */
export const execute = (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(
        `Esta sonando **[${track.title} by ${track.author}](<${track.url}>)**`
    );
};

export const type = 'playerStart';
export const once = false;
