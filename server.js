const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json())

// Import routes
const testsRoute = require('./routes/tests')
const statisticsRoute = require('./routes/statistics')

app.use('/tests', testsRoute)
app.use('/statistics', statisticsRoute)

// Routes
app.get('/', (req, res) => {
    res.send('HOME');
});

// Connect to database
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () => console.log("Connected to database!")
);

// Start listening
app.listen(3000);