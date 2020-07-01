const mongoose = require('mongoose');

const StandingSchema = mongoose.Schema({
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

module.exports = mongoose.model('Standing', StandingSchema);