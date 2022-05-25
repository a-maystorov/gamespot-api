const { Genre } = require('./models/genre');
const { Game } = require('./models/game');
const mongoose = require('mongoose');

const data = [
  {
    name: 'MMORPG',
    games: [
      { title: 'World of Warcraft', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'Final Fantasy XIV', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'Blade and Soul', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: 'MOBA',
    games: [
      { title: 'League of Legends', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'Dota 2', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'Heroes of the Storm', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: 'RPG',
    games: [
      { title: 'Dark Souls', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'Bloodbourne', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'Elden Ring', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
  {
    name: 'FPS',
    games: [
      { title: 'Counter Strike', numberInStock: 5, dailyRentalRate: 2 },
      { title: 'Valorant', numberInStock: 10, dailyRentalRate: 2 },
      { title: 'Quake', numberInStock: 15, dailyRentalRate: 2 },
    ],
  },
];

async function seed() {
  await mongoose.connect(`mongodb://localhost:27017/gamespot_tests`);

  await Game.deleteMany({});
  await Genre.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const games = genre.games.map((game) => ({
      ...game,
      genre: { _id: genreId, name: genre.name },
    }));
    await Game.insertMany(games);
  }

  mongoose.disconnect();

  console.info('Done!');
}

seed();
