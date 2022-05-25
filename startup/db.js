const winston = require('winston');
const mongoose = require('mongoose');

const DB = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@gamespot.lnlf7.mongodb.net/?retryWrites=true&w=majority`;
const TESTS_DB = process.env.TESTS_DB_URI;

module.exports = function () {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`Connected to ${DB}.`));
};
