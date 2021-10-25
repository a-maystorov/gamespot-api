require('dotenv').config();

const winston = require('winston');

const PORT = process.env.PORT;

const express = require('express');
const app = express();

require('./startup/logger')();

require('./startup/routes')(app);
require('./startup/prod')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const server = app.listen(PORT, () =>
    winston.info(`Listening on port ${PORT}.`)
);

module.exports = server;