const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
const { Game } = require('../../../models/game');
const mongoose = require('mongoose');

describe('/api/games', () => {
  let server;

  beforeEach(() => {
    server = require('../../../app');
  });

  afterEach(async () => {
    await server.close();
    await Game.deleteMany({});
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all games', async () => {
      await Game.collection.insertMany([
        {
          title: 'game1',
          genre: { name: 'genre1' },
          numberInStock: 1,
          dailyRentalRate: 2,
        },
        {
          title: 'game2',
          genre: { name: 'genre2' },
          numberInStock: 3,
          dailyRentalRate: 4,
        },
      ]);

      const res = await request(server).get('/api/games');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.title === 'game1')).toBeTruthy();
      expect(res.body.some((g) => g.genre.name === 'genre2')).toBeTruthy();
      expect(res.body.some((g) => g.numberInStock === 1)).toBeTruthy();
      expect(res.body.some((g) => g.dailyRentalRate === 4)).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
      return token;
    });

    it('should return 401 if user is not logged in', async () => {
      const game = new Game({
        title: 'game1',
        genre: { name: 'genre1' },
        numberInStock: 1,
        dailyRentalRate: 2,
      });
      await game.save();

      token = '';

      const res = await request(server)
        .get('/api/games/' + game._id)
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
    });

    it('should return a game if valid id is passed', async () => {
      const game = new Game({
        title: 'game1',
        genre: { name: 'genre1' },
        numberInStock: 1,
        dailyRentalRate: 2,
      });
      await game.save();

      const res = await request(server)
        .get('/api/games/' + game._id)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'game1');
      expect(res.body).toHaveProperty('genre');
      expect(res.body.genre).toHaveProperty('name', 'genre1');
      expect(res.body).toHaveProperty('numberInStock', 1);
      expect(res.body).toHaveProperty('dailyRentalRate', 2);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server)
        .get('/api/games/1')
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });

    it('should return 404 if no game with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server)
        .get('/api/games/' + id)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let title;
    let genreId;
    let numberInStock;
    let dailyRentalRate;

    const exe = async () => {
      return await request(server)
        .post('/api/games')
        .set('x-auth-token', token)
        .send({ title, genreId, numberInStock, dailyRentalRate });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      title = 'game1';
      genreId = mongoose.Types.ObjectId();
      numberInStock = 1;
      dailyRentalRate = 1;

      const genre = new Genre({ _id: genreId, name: 'genre1' });
      await genre.save();
    });

    it('should return 401 if user is not loggend in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 400 if title is less than 3 characters', async () => {
      title = 'ab';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if title is more than 50 characters', async () => {
      title = new Array(52).join('a');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genreId is not provided', async () => {
      genreId = '';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if invalid genreId is provided', async () => {
      genreId = 1;

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if numberInStock is less than 0', async () => {
      numberInStock = -1;

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if dailyRentalRate is less than 0', async () => {
      dailyRentalRate = -1;

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should save the game if it is valid', async () => {
      await exe();

      const game = await Game.find({ name: 'game1' });

      expect(game).not.toBeNull();
    });

    it('should return the game if it is valid', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'game1');
      expect(res.body).toHaveProperty('genre');
      expect(res.body.genre).toHaveProperty('name', 'genre1');
      expect(res.body).toHaveProperty('numberInStock', 1);
      expect(res.body).toHaveProperty('dailyRentalRate', 1);
    });
  });

  describe('PUT /:id', () => {
    let token;
    let game;
    let newTitle;
    let newGenreId;
    let newGenre;
    let newNumberInStock;
    let newDailyRentalRate;
    let id;

    const exe = async () => {
      return await request(server)
        .put('/api/games/' + id)
        .set('x-auth-token', token)
        .send({
          title: newTitle,
          genreId: newGenreId,
          numberInStock: newNumberInStock,
          dailyRentalRate: newDailyRentalRate,
        });
    };

    beforeEach(async () => {
      const genreId = mongoose.Types.ObjectId();
      const genre = new Genre({ _id: genreId, name: 'genre1' });
      await genre.save();

      game = new Game({
        title: 'game1',
        genre,
        numberInStock: 1,
        dailyRentalRate: 1,
      });

      await game.save();

      const updatedGenreId = mongoose.Types.ObjectId();
      const updatedGenre = new Genre({ _id: updatedGenreId, name: 'genre2' });
      await updatedGenre.save();

      token = new User().generateAuthToken();
      id = game._id;
      newTitle = 'updatedTitle';
      newGenreId = updatedGenreId;
      newGenre = updatedGenre;
      newNumberInStock = 2;
      newDailyRentalRate = 2;
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 400 if title is less than 3 characters', async () => {
      newTitle = 'ab';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if title is more than 50 characters', async () => {
      newTitle = new Array(52).join('a');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genreId is not provided', async () => {
      newGenreId = '';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genreId is invalid', async () => {
      newGenreId = 1;

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if numberInStock is less than 0', async () => {
      newNumberInStock = -1;

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if dailyRentalRate is less than 0', async () => {
      newDailyRentalRate = -1;

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 404 if game id is invalid', async () => {
      id = 1;

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should return 404 if game with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should update the game if input is valid', async () => {
      await exe();

      const updatedGame = await Game.findById(game._id);

      expect(updatedGame.title).toBe(newTitle);
      expect(updatedGame.genre.name).toBe(newGenre.name);
      expect(updatedGame.numberInStock).toBe(newNumberInStock);
      expect(updatedGame.dailyRentalRate).toBe(newDailyRentalRate);
    });

    it('should return the updated game if it is valid', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', newTitle);
      expect(res.body).toHaveProperty('genre');
      expect(res.body.genre).toHaveProperty('name', newGenre.name);
      expect(res.body).toHaveProperty('numberInStock', newNumberInStock);
      expect(res.body).toHaveProperty('dailyRentalRate', newDailyRentalRate);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let game;
    let id;

    const exe = async () => {
      return await request(server)
        .delete('/api/games/' + id)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      const genre = new Genre({ name: 'genre1' });

      game = new Game({
        title: 'game1',
        genre,
        numberInStock: 1,
        dailyRentalRate: 1,
      });

      await game.save();

      id = game._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exe();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no game with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should delete the game if input is valid', async () => {
      await exe();

      const gameInDB = await Game.findById(id);

      expect(gameInDB).toBeNull();
    });

    it('should return the removed customer', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id', game._id.toHexString());
      expect(res.body).toHaveProperty('title', game.title);
      expect(res.body).toHaveProperty('genre');
      expect(res.body.genre).toHaveProperty('name', game.genre.name);
      expect(res.body).toHaveProperty('numberInStock', game.numberInStock);
      expect(res.body).toHaveProperty('dailyRentalRate', game.dailyRentalRate);
    });
  });
});
