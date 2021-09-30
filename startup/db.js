const logger = require('./logger');
const mongoose = require('mongoose');

const DB = process.env.DB_URI;

module.exports = function() {
    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => logger.info(`Connected to ${DB}.`));
};