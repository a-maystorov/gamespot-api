const request = require('supertest');
const { Game } = require('../../../models/game');
const { Customer } = require('../../../models/customer');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');

describe('/api/rentals', () => {
  beforeEach(() => {
    server = require('../../../app');
  });

  afterEach(async () => {
    await server.close();
    await Game.deleteMany({});
    await Customer.deleteMany({});
    await Rental.deleteMany({});
  });

  describe('GET /', () => {
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it('should return all rentals', async () => {
      await Rental.collection.insertMany([
        {
          customer: {
            name: 'customer1',
            phone: '123456',
          },
          game: {
            title: 'title1',
            dailyRentalRate: 2,
          },
        },
        {
          customer: {
            name: 'customer2',
            phone: '654321',
          },
          game: {
            title: 'title2',
            dailyRentalRate: 3,
          },
        },
      ]);

      const res = await request(server)
        .get('/api/rentals')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((r) => r.customer.name === 'customer1')
      ).toBeTruthy();
      expect(res.body.some((r) => r.game.title === 'title1')).toBeTruthy();
      expect(res.body.some((r) => r.customer.phone === '654321')).toBeTruthy();
      expect(res.body.some((r) => r.game.dailyRentalRate === 3)).toBeTruthy();
    });
  });
});
