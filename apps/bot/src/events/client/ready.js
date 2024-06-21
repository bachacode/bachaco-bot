import { Events } from 'discord.js';

/** @typedef {import('discord.js').Client} Client */

/**
 * @param {Client} c
 */
export const execute = (c) => {
    c.logger.info(`¡Listo! Logeado como ${c.user.tag}`);
};

export const type = Events.ClientReady;
export const once = true;
