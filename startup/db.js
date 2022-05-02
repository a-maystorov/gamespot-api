const winston = require('winston');
const mongoose = require('mongoose');

const DB = `mongodb://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@mycluster.lnlf7.mongodb.net/gameSpot?retryWrites=true&w=majority`;
const TESTS_DB = process.env.TESTS_DB_URI;

module.exports = function () {
  mongoose
    .connect(TESTS_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`Connected to ${TESTS_DB}.`));
};
