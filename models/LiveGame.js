const mongoose = require('mongoose');

const EventsSchema = mongoose.Schema({
    elapsed: Number,
    teamId: Number,
    player: String,
    assist: String,
    type: String,
    detail: String,
})

const LiveGameSchema = mongoose.Schema({
    fixtureId: Number,
    leagueId: Number,
    leagueName: String,
    eventDate: Date,
    eventTimestamp: Number,
    round: String,
    status: String,
    elapsed: Number,
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
    events: [EventsSchema]
});

module.exports = mongoose.model('LiveGame', LiveGameSchema);