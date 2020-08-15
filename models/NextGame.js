// Initialize necessary modules for database
const mongoose = require('mongoose');

// Create the structure of data that the database will hold
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

// Finalize the structure of data by putting the details of
// next games into an array, and it's leagueId
const NextGameSchema = mongoose.Schema({
  leagueId: Number,
  nextgames: [NextGameDetails]
});

// Export the model to be used by routes so database operations can be performed
module.exports = mongoose.model('NextGame', NextGameSchema);