// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');

// Info to acquire X next games based on league.
const FETCH_LIVE_GAMES_URL = 'http://v2.api-football.com/fixtures/live/524-775-891-754-1329';

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the information on page load
router.get('/', async (req, res) => {
    try {
        const fetchLiveGames = await fetch(FETCH_LIVE_GAMES_URL, httpHeaders);
        const data = await fetchLiveGames.json();
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;