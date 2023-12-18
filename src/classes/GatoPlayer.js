const { Player } = require('discord-player');
const path = require('path');
const fs = require('fs');

class GatoPlayer extends Player {
    constructor(client, root) {
        super(client);

        this.extractors.loadDefault();
        this.root = root;
        this.setEvents();
    }

    setEvents() {
        const foldersPath = path.join(this.root, 'events', 'player');
        const eventFiles = fs.readdirSync(foldersPath).filter((file) => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(foldersPath, file);
            const event = require(filePath);
            if ('type' in event && 'once' in event && 'execute' in event) {
                if (event.once) {
                    this.once(event.type, event.execute);
                } else {
                    this.on(event.type, event.execute);
                }
                console.log('Player Event Loaded: ' + file.split('.')[0]);
            } else {
                console.log(
                    `[WARNING] The event at ${filePath} is missing a required "type", "once" or "execute" property.`
                );
            }
        }
    }
}

module.exports = GatoPlayer;
