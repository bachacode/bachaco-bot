const { Events } = require('discord.js');

/** @typedef {import('discord.js').Client} Client */

/**
 * @param {Client} c
 */
const execute = (c) => {
    console.log(`¡Listo! Logeado como ${c.user.tag}`);
};

module.exports = {
    type: Events.ClientReady,
    once: true,
    execute
};
