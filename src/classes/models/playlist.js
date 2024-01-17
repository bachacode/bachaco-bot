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
        name: {
            type: SchemaTypes.String,
            required: true,
            unique: true
        },
        author: {
            type: SchemaTypes.String,
            required: true
        },
        url: {
            type: SchemaTypes.String,
            require: true
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