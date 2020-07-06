// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const LastGame = require('../models/LastGame');

// Info to acquire X last games based on league.
const FETCH_LAST_GAMES_URL_1 = 'http://v2.api-football.com/fixtures/league/'
const FETCH_LAST_GAMES_URL_2 = '/last/10'
const leagueIds = [524, 775, 891, 754, 1329] // ENG, ITA, SPA, GER, SWE
let lastGamesCollection = [];

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the upcoming games information on page load, returns json object and updates the database.
router.get('/', async (req, res) => {
    lastGamesCollection = [];
    try {
        for(let i = 0; i < leagueIds.length; i++) {
            const savedLastGames = await fetch(
                FETCH_LAST_GAMES_URL_1 + leagueIds[i] + FETCH_LAST_GAMES_URL_2, httpHeaders
            );
            const data = await savedLastGames.json();
            updateLastGames(data, leagueIds[i]);
        }
        updateDatabase();
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

// For the front-end to acquire
router.get('/test', async (req, res) => {
    try {
        const savedLastGames = await LastGame.find({});
        res.json(savedLastGames);
    } catch (err) {
        res.json({ message: err });
    }
});

// Deletes and inserts the new upcoming games to the database collection 'dev.lastgames'.
const updateLastGames = async (data, leagueId) => {
    lastGamesLength = data.api.fixtures.length;
    let lastGamesList = [];
    for(let i = 0; i < lastGamesLength; i++) {
        const lastGames = data.api.fixtures;
        const lastGameObject = {
            fixtureId: lastGames[i].fixture_id,
            leagueId: lastGames[i].league_id,
            leagueName: lastGames[i].league.name,
            eventDate: lastGames[i].event_date,
            eventTimestamp: lastGames[i].event_timestamp,
            round: lastGames[i].round,
            status: lastGames[i].status,
            homeTeam: {
                teamId: lastGames[i].homeTeam.team_id,
                teamName: lastGames[i].homeTeam.team_name,
                teamLogo: lastGames[i].homeTeam.logo,
            },
            awayTeam: {
                teamId: lastGames[i].awayTeam.team_id,
                teamName: lastGames[i].awayTeam.team_name,
                teamLogo: lastGames[i].awayTeam.logo,
            },
            goalsHomeTeam: lastGames[i].goalsHomeTeam,
            goalsAwayTeam: lastGames[i].goalsAwayTeam,
        };
        lastGamesList.push(lastGameObject);
    }
    lastGamesCollection.push({leagueId: leagueId, lastgames: lastGamesList});
}

const updateDatabase = async () => {
    try {
        await LastGame.deleteMany({});
        console.log("Last games database entries removed");
        await LastGame.insertMany(lastGamesCollection);
        console.log("Last games database entries updated");
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;