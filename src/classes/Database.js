const { default: mongoose } = require('mongoose');
const playlist = require('./models/playlist');

const url = process.env.DATABASE_URL;

class Database {
    playlist = playlist;

    constructor(url) {
        this.run(url).catch(console.dir);
    }

    async run(connectionUrl) {
        this.db = await mongoose.connect(connectionUrl);
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database(url);
        }
        return this.instance;
    }

    // Other methods and properties here
}

module.exports.db = Database.getInstance();
