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
      isGold = false;
    });

    it('should return 401 if user is not loggend in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 400 if name is less than 3 characters', async () => {
      name = 'ab';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 20 characters', async () => {
      name = new Array(22).join('a');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if phone is less than 6 characters', async () => {
      phone = '12345';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if phone is more than 20 characters', async () => {
      name = new Array(22).join('1');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should save the customer if it is valid', async () => {
      await exe();

      const customer = await Customer.find({ name: 'customer1' });

      expect(customer).not.toBeNull();
    });

    it('should return the customer if it is valid', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'customer1');
      expect(res.body).toHaveProperty('phone', '123456');
      expect(res.body).toHaveProperty('isGold', false);
    });
  });

  describe('PUT /:id', () => {
    let token;
    let customer;
    let newName;
    let newPhone;
    let newGoldStatus;
    let id;

    const exe = async () => {
      return await request(server)
        .put('/api/customers/' + id)
        .set('x-auth-token', token)
        .send({ name: newName, phone: newPhone, isGold: newGoldStatus });
    };

    beforeEach(async () => {
      customer = new Customer({
        name: 'customer1',
        phone: '123456',
        isGold: false,
      });
      await customer.save();

      token = new User().generateAuthToken();
      id = customer._id;
      newName = 'updatedName';
      newPhone = '654321';
      newGoldStatus = true;
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await exe();

      expect(res.status).toBe(401);
    });

    it('should return 400 if name is less than 3 characters', async () => {
      newName = 'ab';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 20 characters', async () => {
      newName = new Array(22).join('a');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if phone is less than 6 characters', async () => {
      newPhone = '12345';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if phone is more than 20 characters', async () => {
      newPhone = new Array(22).join('1');

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should return 404 if customer with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should update the customer if input is valid', async () => {
      await exe();

      const updatedCustomer = await Customer.findById(customer._id);

      expect(updatedCustomer.name).toBe(newName);
      expect(updatedCustomer.phone).toBe(newPhone);
      expect(updatedCustomer.isGold).toBe(newGoldStatus);
    });

    it('should return the updated customer if it is valid', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
      expect(res.body).toHaveProperty('phone', newPhone);
      expect(res.body).toHaveProperty('isGold', newGoldStatus);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let customer;
    let id;

    const exe = async () => {
      return await request(server)
        .delete('/api/customers/' + id)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      customer = new Customer({ name: 'customer1', phone: '123456' });
      await customer.save();

      id = customer._id;
      token = new User({ isAdmin: true }).generateAuthToken();
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

    it('should return 404 if no customer with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exe();

      expect(res.status).toBe(404);
    });

    it('should delete the customer if input is valid', async () => {
      await exe();

      const customerInDb = await Customer.findById(id);

      expect(customerInDb).toBeNull();
    });

    it('should return the removed customer', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id', customer._id.toHexString());
      expect(res.body).toHaveProperty('name', customer.name);
      expect(res.body).toHaveProperty('phone', customer.phone);
    });
  });
});
