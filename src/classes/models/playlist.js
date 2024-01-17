const { randomUUID } = require('crypto');
const { Schema, SchemaTypes, model } = require('mongoose');

const playlistSchema = new Schema(
    {
        id: {
            type: SchemaTypes.String,
            required: true,
            unique: true,
            default: () => randomUUID()
        },
        author: {
            type: SchemaTypes.String,
            required: true
        },
        name: {
            type: SchemaTypes.String,
            required: true
        },
        tracks: {
            type: [SchemaTypes.Mixed],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Playlist', playlistSchema);
