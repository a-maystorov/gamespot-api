const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
const { Game } = require('../../../models/game');
const mongoose = require('mongoose');

describe('/api/games', () => {
  beforeEach(() => {
    server = require('../../../app');
  });

  afterEach(async () => {
    await server.close();
    await Game.deleteMany({});
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
      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          'title',
          'genre',
          'numberInStock',
          'dailyRentalRate',
        ])
      );
      expect(res.body).toHaveProperty('title', game.title);
      expect(res.body).toHaveProperty('numberInStock', game.numberInStock);
      expect(res.body).toHaveProperty('dailyRentalRate', game.dailyRentalRate);
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
});
