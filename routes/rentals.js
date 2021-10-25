const { Rental, validate } = require('../models/rental');
const { Game } = require('../models/game');
const { Customer } = require('../models/customer');

const Fawn = require('fawn');

const express = require('express');
const router = express.Router();

Fawn.init(process.env.DB_URI);

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', auth, async(req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
});

router.post('/', auth, async(req, res) => {
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

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('games', { _id: game._id }, { $inc: { numberInStock: -1 } })
            .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send('Something went wrong...');
    }
});

router.get('/:id', [auth, validateObjectId], async(req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
        return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router;