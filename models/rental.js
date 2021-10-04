const Joi = require('joi');
const mongoose = require('mongoose');
const { customerSchema } = require('./customer');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    game: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});

rentalSchema.statics.lookup = function(customerId, gameId) {
    return this.findOne({
        'customer._id': customerId,
        'game._id': gameId,
    });
};

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.game.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        gameId: Joi.objectId().required(),
    });

    return schema.validate(rental);
}

module.exports = { Rental, validate: validateRental };