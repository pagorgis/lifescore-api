// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const LastGame = require('../models/LastGame');
const schedule = require('node-schedule');
const cron = require('node-cron');

// Info to acquire X last games based on league.
const FETCH_LAST_GAMES_URL_1 = 'http://v2.api-football.com/fixtures/league/';
const FETCH_LAST_GAMES_URL_2 = '/last/10';
const leagueIds = [2790, 2833, 2857, 2755, 1329]; // ENG, ITA, SPA, GER, SWE

// Stores objects containing processed data from API for each league (length of leagueIds).
let lastGamesCollection = [];

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Imports node-cron to execute the fetch function at midnight.
let scheduleUpdate = cron.schedule('0 0 * * *', () => {
    fetchFromApiUpdateDb();
});

// Fetches data from the API of relevant leagues, structures the data as Javascript objects, 
// then push the array of last games for each league to the database.
const fetchFromApiUpdateDb = async () => {
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
    } catch (err) {
        console.log(err);
    }
};

// Creates the data structure for previous games and pushes them to lastGamesCollection array. 
// Each element contains a certain league.
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
};

// Updates the database by removing previous records and inserting the new ones in lastGamesCollection.
const updateDatabase = async () => {
    try {
        await LastGame.deleteMany({});
        console.log("LAST games database entries removed | " + Date(Date.now()));
        await LastGame.insertMany(lastGamesCollection);
        console.log("LAST games database entries updated | " + Date(Date.now()));
    } catch (err) {
        console.log(err);
    }
};

// The GET-request from the front-end to acquire the data from the database.
router.get('/', async (req, res) => {
    try {
        const savedLastGames = await LastGame.find({});
        res.json(savedLastGames);
    } catch (err) {
        res.json({ message: err });
    }
});

// Fetches the previous games information on page load, returns json object and updates the database.
/*
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
        res.json(lastGamesCollection);
    } catch (err) {
        res.json({ message: err });
    }
});
*/

module.exports = router;