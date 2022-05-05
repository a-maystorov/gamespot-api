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
});
