// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const NextGame = require('../models/NextGame');

// Info to acquire X next games based on league.
const FETCH_NEXT_GAMES_URL = 'http://v2.api-football.com/fixtures/league/524/next/18'
const leagueIds = [524, 775, 891, 754, 1329] // ENG, ITA, SPA, GER, SWE

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the upcoming games information on page load, returns json object and updates the database.
router.get('/', async (req, res) => {
    try {
        const savedNextGames = await fetch(FETCH_NEXT_GAMES_URL, httpHeaders);
        const data = await savedNextGames.json();
        updateNextGames(data);
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

// Deletes and inserts the new upcoming games to the database collection 'dev.nextgames'.
const updateNextGames = async data => {
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
    try {
        await NextGame.deleteMany({});
        console.log("Data removed");
        await NextGame.insertMany(nextGamesList);
        console.log("Data inserted");
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;