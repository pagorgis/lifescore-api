const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import routes
const liveGamesRoute = require('./routes/livegames');
const lastGamesRoute = require('./routes/lastgames');
const nextGamesRoute = require('./routes/nextgames');
const standingsRoute = require('./routes/standings');


app.use('/livegames', liveGamesRoute);
app.use('/lastgames', lastGamesRoute);
app.use('/nextgames', nextGamesRoute);
app.use('/standings', standingsRoute);

// Routes
app.get('/', (req, res) => {
    res.send('Hello world!');
});

// Connect to database
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to database!")
);

// Start listening
app.listen(3000);