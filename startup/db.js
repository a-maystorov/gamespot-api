const winston = require('winston');
const mongoose = require('mongoose');

const DB = process.env.DB_URI; // change this to your local db uri
const TESTS_DB = process.env.TESTS_DB_URI; // same for test db

module.exports = function() {
    mongoose
        .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => winston.info(`Connected to ${DB}.`));
};