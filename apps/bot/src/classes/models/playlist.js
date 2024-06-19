import { randomUUID } from 'crypto';
import { Schema, SchemaTypes, model } from 'mongoose';

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
            required: false
        },
        url: {
            type: SchemaTypes.String,
            require: false
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

export default model('Playlist', playlistSchema);
