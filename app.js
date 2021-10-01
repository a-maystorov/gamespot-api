require('dotenv').config();

const PORT = process.env.PORT;

const express = require('express');
const app = express();

const logger = require('./startup/logger');

require('./startup/routes')(app);
require('./startup/prod')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const server = app.listen(PORT, () =>
    logger.info(`Listening on port ${PORT}.`)
);

module.exports = server;