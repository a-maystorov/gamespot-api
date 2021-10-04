const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const { Game } = require('../../../models/game');

const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

jest.setTimeout(100 * 1000);

describe('/api/returns', () => {
    let server;
    let customerId;
    let gameId;
    let rental;
    let token;
    let game;

    const exe = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, gameId });
    };

    beforeEach(async() => {
        server = require('../../../app');

        customerId = mongoose.Types.ObjectId();
        gameId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        game = new Game({
            _id: gameId,
            title: '12345',
            dailyRentalRate: 3,
            genre: { name: '12345' },
            numberInStock: 10,
        });

        await game.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '123',
                phone: '123456',
            },
            game: {
                _id: gameId,
                title: '123',
                dailyRentalRate: 2,
            },
        });

        await rental.save();
    });

    afterEach(async() => {
        await server.close();
        await Rental.remove({});
        await Game.remove({});
    });

    it('should return 401 if client is not logged in', async() => {
        token = '';

        const res = await exe();

        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided', async() => {
        customerId = '';

        const res = await exe();

        expect(res.status).toBe(400);
    });

    it('should return 400 if gameId is not provided', async() => {
        gameId = '';

        const res = await exe();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for the customer/game', async() => {
        await Rental.remove({});

        const res = await exe();

        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async() => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exe();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async() => {
        const res = await exe();

        expect(res.status).toBe(200);
    });

    it('should set the returnDate if inut is valid', async() => {
        await exe();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rentalFee if inut is valid', async() => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exe();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the game stock if input is valid', async() => {
        await exe();

        const gameInDb = await Game.findById(gameId);

        expect(gameInDb.numberInStock).toBe(game.numberInStock + 1);
    });

    it('should return the rental if input is valid ', async() => {
        const res = await exe();

        await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining([
                'dateOut',
                'dateReturned',
                'rentalFee',
                'customer',
                'game',
            ])
        );
    });
});