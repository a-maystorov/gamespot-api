const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: "GameSpot" },
    transports: [
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({ filename: "logs/combined.log" }),
    ],
  });

  winston.exceptions.handle(
    new winston.transports.File({ filename: "logs/exceptions.log" }),

    process.on("uncaughtException", (ex) => {
      throw ex;
    })
  );

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        handleExceptions: true,
      })
    );
  }
};
