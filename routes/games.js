const { Game, validate } = require('../models/game');
const { Genre } = require('../models/genre');

const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    const games = await Game.find().sort({ name: 1 });
    res.send(games);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const game = new Game({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    await game.save();

    res.send(game);
});

router.put('/:id', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const game = await Game.findByIdAndUpdate(
        req.params.id, {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        }, { new: true }
    );

    if (!game)
        return res.status(404).send('The game with the given ID was not found.');

    res.send(game);
});

router.delete('/:id', async(req, res) => {
    const game = await Game.findByIdAndRemove(req.params.id);

    if (!game)
        return res.status(404).send('The game with the given ID was not found.');

    res.send(game);
});

router.get('/:id', async(req, res) => {
    const game = await Game.findById(req.params.id);

    if (!game)
        return res.status(404).send('The game with the given ID was not found.');

    res.send(game);
});

module.exports = router;