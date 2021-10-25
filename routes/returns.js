const express = require('express');
const router = express.Router();

const Joi = require('joi');

const { Rental } = require('../models/rental');
const { Game } = require('../models/game');

const auth = require('../middleware/auth');

router.post('/', auth, async(req, res) => {
    const { error } = validateReturn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.lookup(req.body.customerId, req.body.gameId);

    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned)
        return res.status(400).send('Return already processed.');

    rental.return();
    await rental.save();

    await Game.updateOne({ _id: rental.game._id }, {
        $inc: { numberInStock: 1 },
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        gameId: Joi.objectId().required(),
    });

    return schema.validate(req);
}

module.exports = router;