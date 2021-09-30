module.exports = function asyncMiddleware(handler) {
    return async(req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            next(ex);
        }
    };
};

// Can achive the same result with the express-async-errors package.