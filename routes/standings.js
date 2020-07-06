// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const Standing = require('../models/Standing');

// Fetch statistics based on league. Add leagueId after leagueTable/.
const FETCH_STATISTICS_URL = 'http://v2.api-football.com/leagueTable/'
const leagueIds = [524, 775, 891, 754, 1329] // ENG, ITA, SPA, GER, SWE
let standingsCollection = [];

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the standings information on page load, returns json object and updates the database.
router.get('/', async (req, res) => {
    standingsCollection = [];
    try {
        for(let i = 0; i < leagueIds.length; i++) {
            const savedStandings = await fetch(FETCH_STATISTICS_URL + leagueIds[i], httpHeaders);
            const data = await savedStandings.json();
            updateStandings(data, leagueIds[i]);
        }
        updateDatabase();
        res.json(standingsCollection);
    } catch (err) {
        res.json({ message: err });
    }
});

// For the front-end to acquire
router.get('/test', async (req, res) => {
    try {
        const savedStandings = await Standing.find({});
        res.json(savedStandings);
    } catch (err) {
        res.json({ message: err });
    }
});

// Deletes and inserts the new standings to the database collection 'dev.standings'.
const updateStandings = async (data, leagueId) => {
    standingsLength = data.api.standings[0].length;
    let standingsList = [];
    for(let i = 0; i < standingsLength; i++) {
        const standings = data.api.standings[0];
        const standingObject = {
            leagueId: leagueId,
            rank: standings[i].rank,
            teamId: standings[i].team_id,
            teamName: standings[i].teamName,
            teamLogo: standings[i].logo,
            group: standings[i].group,
            form: standings[i].forme,
            gamesPlayed: standings[i].all.matchsPlayed,
            wins: standings[i].all.win,
            draws: standings[i].all.draw,
            losses: standings[i].all.lose,
            goalsFor: standings[i].all.goalsFor,
            goalsAgainst: standings[i].all.goalsAgainst,
            goalsDiff: standings[i].goalsDiff,
            points: standings[i].points,
        };
        standingsList.push(standingObject);
    }
    standingsCollection.push({leagueId: leagueId, standings: standingsList});
}

const updateDatabase = async () => {
    try {
        await Standing.deleteMany({});
        console.log("Standings database entries removed");
        await Standing.insertMany(standingsCollection);
        console.log("Standings database entries updated");
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;