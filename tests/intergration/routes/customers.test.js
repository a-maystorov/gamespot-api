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
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
      return token;
    });

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
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
      return token;
    });

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

  describe('POST /', () => {
    let token;
    let name;
    let phone;

    const exe = async () => {
      return await request(server)
        .post('/api/customers')
        .set('x-auth-token', token)
        .send({ name, phone });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'customer1';
      phone = '123456';
    });

    it('should return 401 if user is not loggend in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 400 if customer name is less than 3 characters', async () => {
      name = 'ab';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if customer name is more than 20 characters', async () => {
      name = new Array(22).join('a');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if customer phone is less than 6 characters', async () => {
      phone = '12345';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if customer phone is more than 20 characters', async () => {
      name = new Array(22).join('1');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should save the customer if it is valid', async () => {
      await exe();

      const customer = await Customer.find({ name: 'genre1' });

      expect(customer).not.toBeNull();
    });

    it('should return the customer if it is valid', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'customer1');
      expect(res.body).toHaveProperty('phone', '123456');
    });
  });
});
