const config = {
    PORT: 3000,
    DB_URI: `mongodb://127.0.0.1:27017/js-coursebook-exam`,
    SALT_ROUNDS: 10,
    SECRET: 'MNOGOQKASOL',
    COOKIE_NAME: 'TOKEN'
};

module.exports = config