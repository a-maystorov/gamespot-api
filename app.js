const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const DB = process.env.DB_URI;

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const games = require('./routes/games');
const rentals = require('./routes/rentals');

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to ${DB}`));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/games', games);
app.use('/api/rentals', rentals);

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));