const request = require('supertest');
const { Game } = require('../../../models/game');
const { Customer } = require('../../../models/customer');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');

describe('/api/rentals', () => {
  let server;

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

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await request(server)
        .get('/api/rentals')
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
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

  describe('GET /:id', () => {
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
      return token;
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await request(server)
        .get('/api/rentals')
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
    });

    it('should return a rental if valid id is passed', async () => {
      const rental = new Rental({
        customer: {
          name: 'customer1',
          phone: '123456',
        },
        game: {
          title: 'title1',
          dailyRentalRate: 2,
        },
      });

      await rental.save();

      const res = await request(server)
        .get('/api/rentals/' + rental._id)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('name', 'customer1');
      expect(res.body).toHaveProperty('game');
      expect(res.body.game).toHaveProperty('dailyRentalRate', 2);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server)
        .get('/api/rentals/1')
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });

    it('should return 404 if no customer with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server)
        .get('/api/rentals/' + id)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let customerId;
    let gameId;
    let customer;
    let game;

    const exe = async () => {
      return await request(server)
        .post('/api/rentals')
        .set('x-auth-token', token)
        .send({ customerId, gameId });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      customerId = mongoose.Types.ObjectId();
      gameId = mongoose.Types.ObjectId();

      customer = new Customer({
        _id: customerId,
        name: 'customer1',
        phone: '123456',
      });
      await customer.save();

      game = new Game({
        _id: gameId,
        title: 'title1',
        genre: { name: '12345' },
        numberInStock: 2,
        dailyRentalRate: 1,
      });
      await game.save();
    });

    it('should return 401 if user is not loggend in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
      customerId = '';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if customerId is invalid', async () => {
      customerId = '123';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if gameId is not provided', async () => {
      gameId = '';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if gameId is invalid', async () => {
      gameId = '123';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    // it('should return 400 if game is out of stock', async () => {
    //   game.numberInStock = 0;

    //   const res = await exe();

    //   expect(res.status).toBe(400);
    // });

    it('should return 200 if we have a valid request', async () => {
      const res = await exe();

      expect(res.status).toBe(200);
    });

    // it('should decrease the game stock if input is valid', async () => {
    //   const res = await exe();

    //   const gameInDb = await Game.findById(gameId);

    //   // expect(gameInDb.numberInStock).toBe(game.numberInStock - 1);
    // });

    it('should return the rental if it is valid', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer');
      expect(res.body.customer).toHaveProperty('name', 'customer1');
      expect(res.body).toHaveProperty('game');
      expect(res.body.game).toHaveProperty('dailyRentalRate', 1);
      expect(res.body).toHaveProperty('dateOut');
    });
  });
});
