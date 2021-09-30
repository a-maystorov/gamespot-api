module.exports = function() {
    if (!process.env.JWT_KEY) {
        console.error('ERROR: JWT Key is not defined.');
        process.exit(1);
    }
};