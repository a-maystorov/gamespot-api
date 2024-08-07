const winston = require("winston");
const mongoose = require("mongoose");

const DB = process.env.DB_URI;

module.exports = function () {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("Connected to DB."))
    .catch((err) => winston.error("Error connecting to DB: ", err));
};
