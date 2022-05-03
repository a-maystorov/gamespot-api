const { User } = require('../../../models/user');
const { Customer } = require('../../../models/customer');

const request = require('supertest');
const mongoose = require('mongoose');

describe('/api/customers', () => {
  let server;
  let token;

  beforeEach(() => {
    server = require('../../../app');
    token = new User().generateAuthToken();
    return token;
  });

  afterEach(async () => {
    await server.close();
    await Customer.deleteMany({});
  });

  describe('GET /', () => {
    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await request(server)
        .get('/api/customers')
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
    });

    it('should return all customers if user is logged in', async () => {
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
  });

  describe('GET /:id', () => {
    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await request(server)
        .get('/api/customers')
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
    });

    it('should return a customer if valid id is passed', async () => {
      const customer = new Customer({ name: 'customer1', phone: '123456' });
      await customer.save();

      const res = await request(server)
        .get('/api/customers/' + customer._id)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', customer.name);
      expect(res.body).toHaveProperty('phone', customer.phone);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server)
        .get('/api/customers/1')
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });

    it('should return 404 if no customer with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server)
        .get('/api/genres/' + id)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
    });
  });
});
