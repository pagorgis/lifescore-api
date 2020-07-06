// Initialize necessary modules
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv/config');
const NextGame = require('../models/NextGame');

// Info to acquire X next games based on league.
const FETCH_NEXT_GAMES_URL_1 = 'http://v2.api-football.com/fixtures/league/'
const FETCH_NEXT_GAMES_URL_2 = '/next/10'
const leagueIds = [524, 775, 891, 754, 1329] // ENG, ITA, SPA, GER, SWE
let nextGamesCollection = [];

// Header used in API Football calls, key is required.
const httpHeaders = {
    headers: {
        "x-rapidapi-host": "v2.api-football.com",
        "x-rapidapi-key": process.env.API_KEY,
    }
};

// Fetches the upcoming games information on page load, returns json object and updates the database.
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

// For the front-end to acquire
router.get('/test', async (req, res) => {
    try {
        const savedNextGames = await NextGame.find({});
        res.json(savedNextGames);
    } catch (err) {
        res.json({ message: err });
    }
});


// Deletes and inserts the new upcoming games to the database collection 'dev.nextgames'.
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
}

const updateDatabase = async () => {
    try {
        await NextGame.deleteMany({});
        console.log("Next games database entries removed");
        await NextGame.insertMany(nextGamesCollection);
        console.log("Next games database entries updated");
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;