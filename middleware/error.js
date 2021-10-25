const winston = require('winston');

module.exports = function(err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send("It's not you it's us...");
};