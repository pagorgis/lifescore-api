// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const NextGame = require('../models/NextGame');
const schedule = require('node-schedule');
const cron = require('node-cron');

// Info to acquire X next games based on league.
const FETCH_NEXT_GAMES_URL_1 = 'http://v2.api-football.com/fixtures/league/';
const FETCH_NEXT_GAMES_URL_2 = '/next/10';
const leagueIds = [524, 775, 891, 754, 1329]; // ENG, ITA, SPA, GER, SWE

// Stores objects containing processed data from API for each league (length of leagueIds).
let nextGamesCollection = [];

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
// then push the array of next games for each league to the database.
const fetchFromApiUpdateDb = async () => {
    nextGamesCollection = [];
    try {
        for(let i = 0; i < leagueIds.length; i++) {
            const savedNextGames = await fetch(
                FETCH_NEXT_GAMES_URL_1 + leagueIds[i] + FETCH_NEXT_GAMES_URL_2, httpHeaders
            );
            const data = await savedNextGames.json();
            updateNextGames(data, leagueIds[i]);
        }
        updateDatabase();
    } catch (err) {
        console.log(err);
    }
};

// Creates the data structure for upcoming games and pushes them to nextGamesCollection array. 
// Each element contains a certain league.
const updateNextGames = async (data, leagueId) => {
    nextGamesLength = data.api.fixtures.length;
    let nextGamesList = [];
    for(let i = 0; i < nextGamesLength; i++) {
        const nextGames = data.api.fixtures;
        const nextGameObject = {
            fixtureId: nextGames[i].fixture_id,
            leagueId: nextGames[i].league_id,
            leagueName: nextGames[i].league.name,
            eventDate: nextGames[i].event_date,
            eventTimestamp: nextGames[i].event_timestamp,
            round: nextGames[i].round,
            status: nextGames[i].status,
            homeTeam: {
                teamId: nextGames[i].homeTeam.team_id,
                teamName: nextGames[i].homeTeam.team_name,
                teamLogo: nextGames[i].homeTeam.logo,
            },
            awayTeam: {
                teamId: nextGames[i].awayTeam.team_id,
                teamName: nextGames[i].awayTeam.team_name,
                teamLogo: nextGames[i].awayTeam.logo,
            },
        };
        nextGamesList.push(nextGameObject);
    }
    nextGamesCollection.push({leagueId: leagueId, nextgames: nextGamesList});
};

// Updates the database by removing previous records and inserting the new ones in nextGamesCollection.
const updateDatabase = async () => {
    try {
        await NextGame.deleteMany({});
        console.log("NEXT games database entries removed | " + Date(Date.now()));
        await NextGame.insertMany(nextGamesCollection);
        console.log("NEXT games database entries updated | " + Date(Date.now()));
    } catch (err) {
        console.log(err);
    }
};

// The GET-request from the front-end to acquire the data from the database.
router.get('/', async (req, res) => {
    try {
        const savedNextGames = await NextGame.find({});
        res.json(savedNextGames);
    } catch (err) {
        res.json({ message: err });
    }
});

// Fetches the upcoming games information on page load, returns json object and updates the database.
/*
router.get('/', async (req, res) => {
    nextGamesCollection = [];
    try {
        for(let i = 0; i < leagueIds.length; i++) {
            const savedNextGames = await fetch(
                FETCH_NEXT_GAMES_URL_1 + leagueIds[i] + FETCH_NEXT_GAMES_URL_2, httpHeaders
            );
            const data = await savedNextGames.json();
            updateNextGames(data, leagueIds[i]);
        }
        updateDatabase();
        res.json(nextGamesCollection);
    } catch (err) {
        res.json({ message: err });
    }
});
*/

module.exports = router;