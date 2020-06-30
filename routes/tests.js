const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// GET STUFF FROM DATABASE
router.get('/', async (req, res) => {
    try {
        const tests = await Test.find();
        res.json(tests);
    } catch (err) {
        res.json({ message: err });
    }
});

// POST TO DATABASE
router.post('/', async (req, res) => {
    console.log(req.body);
    const test = new Test({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savedTest = await test.save();
        res.json(savedTest);
    } catch (err) {
        res.json({ message: err });
    }
});

// SPECIFIC STUFF
router.get('/:testId', async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        res.json(test);
    } catch (err) {
        res.json({ message: err });
    }
});

// DELETE STUFF
router.delete('/:testId', async (req, res) => {
    try {
        const removedTest = await Test.deleteOne({ _id: req.params.testId });
        res.json(removedTest);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;