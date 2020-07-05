// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const LiveGame = require('../models/LiveGame');

// Info to acquire X next games based on league.
const FETCH_LIVE_GAMES_URL = 'http://v2.api-football.com/fixtures/live/524-775-891-754-1329';

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the live games information on page load, returns json object and updates the database.
router.get('/', async (req, res) => {
    try {
        const savedLiveGames = await fetch(FETCH_LIVE_GAMES_URL, httpHeaders);
        const data = await savedLiveGames.json();
        updateLiveGames(data);
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

// For the front-end to acquire
router.get('/test', async (req, res) => {
    try {
        const savedLiveGames = await LiveGame.find({});
        res.json(savedLiveGames);
    } catch (err) {
        res.json({ message: err });
    }
});

// Deletes and inserts the new live games to the database collection 'dev.livegames'.
const updateLiveGames = async data => {
    liveGamesLength = data.api.fixtures.length;
    let liveGamesList = [];
    for(let i = 0; i < liveGamesLength; i++) {
        const liveGames = data.api.fixtures;
        let eventsList = [];
        for(let j = 0; j < liveGames[i].events.length; j++) {
            const eventObject = {
                elapsed: liveGames[i].events[j].elapsed,
                teamId: liveGames[i].events[j].team_id,
                player: liveGames[i].events[j].player,
                assist: liveGames[i].events[j].assist,
                type: liveGames[i].events[j].type,
                detail: liveGames[i].events[j].detail,
            }
            eventsList.push(eventObject);
        }
        
        const liveGameObject = {
            fixtureId: liveGames[i].fixture_id,
            leagueId: liveGames[i].league_id,
            leagueName: liveGames[i].league.name,
            eventDate: liveGames[i].event_date,
            eventTimestamp: liveGames[i].event_timestamp,
            round: liveGames[i].round,
            status: liveGames[i].status,
            elapsed: liveGames[i].elapsed,
            homeTeam: {
                teamId: liveGames[i].homeTeam.team_id,
                teamName: liveGames[i].homeTeam.team_name,
                teamLogo: liveGames[i].homeTeam.logo,
            },
            awayTeam: {
                teamId: liveGames[i].awayTeam.team_id,
                teamName: liveGames[i].awayTeam.team_name,
                teamLogo: liveGames[i].awayTeam.logo,
            },
            goalsHomeTeam: liveGames[i].goalsHomeTeam,
            goalsAwayTeam: liveGames[i].goalsAwayTeam,
            events: eventsList,
        };
        liveGamesList.push(liveGameObject);
    }
    try {
        await LiveGame.deleteMany({});
        console.log("Live games database entries removed");
        await LiveGame.insertMany(liveGamesList);
        console.log("Live games database entries updated");
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;