const PORT = 3000;
const API_VERSION = 'v1';
const SALT_ROUNDS = 10;
const JWT_SECRET = 'my_jwt_secret';
const JWT_EXPIRY = '30m';
const PAGINATION_PAGE_SIZE = 10;

module.exports = {
    PORT,
    API_VERSION,
    SALT_ROUNDS,
    JWT_SECRET,
    JWT_EXPIRY,
    PAGINATION_PAGE_SIZE
}