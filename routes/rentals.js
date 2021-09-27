const { Rental, validate } = require('../models/rental');
const { Game } = require('../models/game');
const { Customer } = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const game = await Game.findById(req.body.gameId);
    if (!game) return res.status(400).send('Invalid game.');

    if (game.numberInStock === 0)
        return res.status(400).send('Game not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        game: {
            _id: game._id,
            title: game.title,
            dailyRentalRate: game.dailyRentalRate,
        },
    });
    rental = await rental.save();

    game.numberInStock--;
    game.save();

    res.send(rental);
});

router.get('/:id', async(req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
        return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router;