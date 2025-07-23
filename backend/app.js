const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = 3000;
const APP_VERSION = '1.0.0';
const SALT_ROUNDS = 10;
const JWT_SECRET = 'my_jwt_secret';

const db = require('./models');

const authenticated = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
        return res.status(400).send('Invalid token.');
    }
    // Verify the token and get user information
    if (!decoded.user_id) {
        return res.status(400).send('Invalid token.');
    }
    // Find the user by ID
    const user = await db.User.findByPk(decoded.user_id);
    if (!user) {
        return res.status(404).send('User not found.');
    }
    req.user = user;
    next();
};  

app.get('/health', (req, res) => {
    res.status(200).send({
        status: 'Healthy',
        api_version: APP_VERSION,
        timestamp: new Date().toLocaleString()
    });
});

app.post('/auth', async (req, res) => {
    const user = await db.User.findOne({
        where: {email: req.body.email}
    });
    if (!user) {
        return res.status(404).send('User not found');
    }
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send('Invalid password');
    }
    const token = jwt.sign(
        {
        user_id: user.id,
        },
        JWT_SECRET,
        { expiresIn: '60m' }
    );
    res.status(200).send({
        message: 'Authentication successful',
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            account_type: user.account_type,
            department: user.department,
        },
        token: token
    });
})

app.get('/portfolio', authenticated, (req, res) => {
    res.send(`Welcome to the portfolio of ${req.user.first_name} ${req.user.last_name}`);
});

app.get('/transactions', authenticated, (req, res) => {
    res.send(`Welcome to the transactions of ${req.user.first_name} ${req.user.last_name}`);
});

app.get('/reports', authenticated, (req, res) => {
    // Assuming reports are stored in a separate model
    res.send(`Welcome to the reports of ${req.user.first_name} ${req.user.last_name}`);
}); 

db.sequelize.sync()
  .then((req) => {
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}!`);
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
