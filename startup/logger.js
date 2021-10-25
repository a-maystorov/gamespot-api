const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

const DB = process.env.DB_URI;
const TESTS_DB = process.env.TESTS_DB_URI;

module.exports = function() {
    winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        ),
        defaultMeta: { service: 'GameSpot' },
        transports: [
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
    });

    winston.exceptions.handle(
        new winston.transports.File({ filename: 'logs/exceptions.log' }),

        process.on('uncaughtException', (ex) => {
            throw ex;
        })
    );

    // winston.add(
    //     new winston.transports.MongoDB({
    //         level: 'info',
    //         db: TESTS_DB,
    //         options: { useUnifiedTopology: true },
    //     })
    // );

    if (process.env.NODE_ENV !== 'production') {
        winston.add(
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
                handleExceptions: true,
            })
        );
    }
};