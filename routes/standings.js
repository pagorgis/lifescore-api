// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const Standing = require('../models/Standing');

// Fetch statistics based on league. Add leagueId after leagueTable/.
const FETCH_STATISTICS_URL = 'http://v2.api-football.com/leagueTable/'
const leagueIds = [524, 775, 891, 754, 1329] // ENG, ITA, SPA, GER, SWE

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the standings information on page load, returns json object and updates the database.
router.get('/', async (req, res) => {
    try {
        const savedTest = await fetch(FETCH_STATISTICS_URL + leagueIds[0], httpHeaders);
        const data = await savedTest.json();
        updateStandings(data);
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

// Deletes and inserts the new standings to the database collection 'dev.standings'.
const updateStandings = async data => {
    standingsLength = data.api.standings[0].length;
    let standingsList = [];
    for(let i = 0; i < standingsLength; i++) {
        const standings = data.api.standings[0];
        const standingObject = {
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
    try {
        await Standing.deleteMany({});
        console.log("Data removed");
        await Standing.insertMany(standingsList);
        console.log("Data inserted");
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;