import express from 'express';
import playlist from '../models/playlist.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const playlists = await playlist.find();
    res.send(playlists);
});

router.get('/global', async (req, res) => {
    const playlists = await playlist.findOne({ id: 'global' });
    res.send(playlists);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const playlists = await playlist.findOne({ id });
    res.send(playlists);
});

export default router;
