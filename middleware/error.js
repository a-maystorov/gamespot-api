module.exports = function(err, req, res, next) {
    try {
        if (!err) next();
    } catch (ex) {
        console.error(err.message);
        res.status(500).send("It's not you it's us...");
    }
};