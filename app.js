const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

const express = require('express');
const app = express();

require('./startup/logger');
require('./startup/prod')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/routes')(app);

const server = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}.`)
);

module.exports = server;