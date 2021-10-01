const request = require('supertest');
const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genre');

let server;

describe('auth middleware', () => {
    let token;

    const exe = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    beforeEach(() => {
        server = require('../../../app');
        token = new User().generateAuthToken();
    });

    afterEach(async() => {
        await Genre.remove({});
        await server.close();
    });

    it('should return 401 if no token is provided', async() => {
        token = '';

        const res = await exe();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async() => {
        token = 'a';

        const res = await exe();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async() => {
        const res = await exe();

        expect(res.status).toBe(200);
    });
});