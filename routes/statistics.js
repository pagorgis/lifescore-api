const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Showing statistics");
});

module.exports = router;