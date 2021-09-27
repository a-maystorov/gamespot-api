const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
    },
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        phone: Joi.string().min(6).max(20).required(),
        isGold: Joi.boolean(),
    });

    return schema.validate(customer);
}

module.exports = { Customer, customerSchema, validate: validateCustomer };