// Initialize necessary modules for database
const mongoose = require('mongoose');

// Create the structure of game events data
const EventsSchema = mongoose.Schema({
    elapsed: Number,
    teamId: Number,
    player: String,
    assist: String,
    type: String,
    detail: String,
})

// Create the structure of data that the database will hold for each
// live game
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

// Export the model to be used by routes so database operations can be performed
module.exports = mongoose.model('LiveGame', LiveGameSchema);