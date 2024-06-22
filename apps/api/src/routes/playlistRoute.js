import express from 'express';
import playlist from '../models/playlist.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const playlists = await playlist.find();

    res.send(playlists);
});

export default router;
