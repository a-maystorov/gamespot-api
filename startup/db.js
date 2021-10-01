const logger = require('./logger');
const mongoose = require('mongoose');

const DB = process.env.DB_URI;
const TESTS_DB = process.env.TESTS_DB_URI;

module.exports = function() {
    if (process.env.NODE_ENV === 'test') {
        mongoose
            .connect(TESTS_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => logger.info(`Connected to ${TESTS_DB}.`));
    } else {
        mongoose
            .connect(DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => logger.info(`Connected to ${DB}.`));
    }
};