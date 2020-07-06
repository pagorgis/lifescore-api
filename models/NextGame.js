const mongoose = require('mongoose');

const NextGameDetails = mongoose.Schema({
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
});

const NextGameSchema = mongoose.Schema({
  leagueId: Number,
  nextgames: [NextGameDetails]
});

module.exports = mongoose.model('NextGame', NextGameSchema);