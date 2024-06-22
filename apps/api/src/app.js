import express from 'express';
import config from './config/config.js';
import playlistRoute from './routes/playlistRoute.js';
import mongoose from 'mongoose';
import getLogger from '@repo/logger';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new logger instance
const logger = getLogger(path.join(__dirname, '..', 'logs'));
// Create express app instance
const app = express();
const port = 3000;
const dbUrl = config.databaseUrl;

// Create DB instance
mongoose
    .connect(dbUrl)
    .then(() => {
        logger.debug('Mongoose connection done successfully');
    })
    .catch((err) => {
        logger.info('Mongoose connection error');
        logger.error(err);
    });

app.use('/api/playlists', playlistRoute);

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`);
});
