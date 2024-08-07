import { Player } from 'discord-player';
import path from 'path';
import fs from 'fs';
import { YoutubeiExtractor } from 'discord-player-youtubei';

class GatoPlayer extends Player {
    constructor(client, options = {}, root) {
        super(client, options);
        this.logger = client.logger;
        this.extractors.register(YoutubeiExtractor, {
            streamOptions: {
                useClient: 'ANDROID'
            }
        });
        this.extractors.loadDefault();
        this.root = root;
        this.setEvents();
    }

    async setEvents() {
        const foldersPath = path.join(this.root, 'events', 'player');
        const eventFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.js'));
        const eventsRegistered = [];
        for (const file of eventFiles) {
            const filePath = path.join('file:///', foldersPath, file);
            const event = await import(filePath);
            if ('type' in event && 'once' in event && 'execute' in event) {
                if (event.once) {
                    this.events.once(event.type, (...args) => event.execute(...args));
                } else {
                    this.events.on(event.type, (...args) => event.execute(...args));
                }
                eventsRegistered.push(` ${file.split('.')[0]}`);
            } else {
                this.logger.warn(
                    `The player event at ${filePath} is missing a required "type", "once" or "execute" property.`
                );
            }
        }

        this.logger.info(`Player events registered: ${eventsRegistered.toString()}`);
    }
}

export default GatoPlayer;
