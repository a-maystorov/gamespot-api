import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));