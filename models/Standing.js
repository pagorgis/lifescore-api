// Initialize necessary modules for database
const mongoose = require('mongoose');

// Create the structure of data that the database will hold
const StandingsDetails = mongoose.Schema({
    leagueId: Number,
    rank: Number,
    teamId: Number,
    teamName: String,
    teamLogo: String,
    group: String,
    form: String,
    gamesPlayed: Number,
    wins: Number,
    draws: Number,
    losses: Number,
    goalsFor: Number,
    goalsAgainst: Number,
    goalsDiff: Number,
    points: Number,
});

// Finalize the structure of data by putting the details of league
// standings into an array, and it's leagueId
const StandingSchema = mongoose.Schema({
    leagueId: Number,
    standings: [StandingsDetails]
});

module.exports = mongoose.model('Standing', StandingSchema);