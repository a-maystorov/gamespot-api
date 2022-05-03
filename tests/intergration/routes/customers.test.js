const { User } = require('../../../models/user');
const { Customer } = require('../../../models/customer');

const request = require('supertest');
const mongoose = require('mongoose');

describe('/api/customers', () => {
  let server;

  beforeEach(() => {
    server = require('../../../app');
  });

  afterEach(async () => {
    await server.close();
    await Customer.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all customers if user is logged in', async () => {
      let token = new User().generateAuthToken();

      await Customer.collection.insertMany([
        { name: 'customer1', phone: '123456' },
        { name: 'customer2', phone: '654321' },
      ]);

      const res = await request(server)
        .get('/api/customers')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((c) => c.name === 'customer1' && c.phone === '123456')
      ).toBeTruthy();
      expect(
        res.body.some((c) => c.name === 'customer2' && c.phone === '654321')
      ).toBeTruthy();
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await request(server)
        .get('/api/customers')
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
    });
  });
});
