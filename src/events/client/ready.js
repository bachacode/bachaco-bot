const { Events } = require('discord.js');
const moment = require('moment');

/** @typedef {import('discord.js').Client} Client */

/**
 * @param {Client} c
 */
const execute = (c) => {
    console.log(`¡Listo! Logeado como ${c.user.tag}`);

    // Set interval for updating global hour
    setInterval(() => {
        const channel = c.channels.cache.get('1186106606283411506');
        const hour = moment().format('hh:mm A');
        channel.setName(hour);
    }, 60000);
};

module.exports = {
    type: Events.ClientReady,
    once: true,
    execute
};
