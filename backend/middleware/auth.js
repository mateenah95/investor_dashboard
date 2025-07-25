const db = require('../models');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/api_config');

const authenticated = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({
            error: 'Access denied. No token provided.'
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).send({
                error: 'Failed to decode JWT token.'
            });
        }
        if (!decoded.user_id) {
            return res.status(401).send({
                error: 'Invalid token format.'
            });
        }
        const user = await db.User.findByPk(decoded.user_id);
        if (!user) {
            return res.status(401).send({
                error: 'User corresponding to JWT token not found.'
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).send({
            error: 'JWT token verification failed.'
        });
    }
};

module.exports = {
    authenticated
}