const logger = require('../startup/logger');

module.exports = function(err, req, res, next) {
    logger.error(err.message);
    res.status(500).send("It's not you it's us...");
};