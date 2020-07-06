const mongoose = require('mongoose');

const LastGameDetails = mongoose.Schema({
    fixtureId: Number,
    leagueId: Number,
    leagueName: String,
    eventDate: Date,
    eventTimestamp: Number,
    round: String,
    status: String,
    homeTeam: {
      teamId: Number,
      teamName: String,
      teamLogo: String,  
    },
    awayTeam: {
        teamId: Number,
        teamName: String,
        teamLogo: String,  
    },
    goalsHomeTeam: Number,
    goalsAwayTeam: Number,
});

const LastGameSchema = mongoose.Schema({
  leagueId: Number,
  lastgames: [LastGameDetails]
});

module.exports = mongoose.model('LastGame', LastGameSchema);