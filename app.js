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
const users = require('./routes/users');
const auth = require('./routes/auth');

const error = require('./middleware/error');

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to ${DB}.`));

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/games', games);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

if (!process.env.JWT_KEY) {
    console.error('ERROR: JWT Key is not defined.');
    process.exit(1);
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));