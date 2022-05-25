const { User } = require('../../../models/user');
const request = require('supertest');
1;
describe('/api/users', () => {
  let server;

  beforeEach(() => {
    server = require('../../../app');
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe('GET /me', () => {
    beforeEach(() => {
      token = new User().generateAuthToken();
      return token;
    });

    it('should return 401 if user is not logged in', async () => {
      token = '';

      const res = await request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);

      expect(res.status).toBe(401);
    });

    it('should return 200 if we have a valid request', async () => {
      const res = await request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
    });
  });

  describe('POST /', () => {
    let name;
    let email;
    let password;

    const exe = async () => {
      return await request(server)
        .post('/api/users')
        .send({ name, email, password });
    };

    beforeEach(() => {
      name = 'user1';
      email = 'email@dev.io';
      password = '123456';
    });

    it('should return 400 if name is less than 3 characters', async () => {
      name = '12';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is less than 5 characters', async () => {
      email = '1234';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is less than 5 characters', async () => {
      password = '1234';

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is already in use', async () => {
      await User.collection.insertOne({
        name: 'user1',
        email: 'email@dev.io',
        password: '12345',
      });

      const res = await exe();

      expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
      const res = await exe();

      expect(res.status).toBe(200);
    });

    it('should return the user if we have a valid request', async () => {
      const res = await exe();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'user1');
      expect(res.body).toHaveProperty('email', 'email@dev.io');
    });
  });
});
