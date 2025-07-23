const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./models');
const app = express();

const PORT = 3000;
const APP_VERSION = '1.0.0';

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).send({
        status: 'Healthy',
        api_version: APP_VERSION,
        timestamp: new Date().toISOString()
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
    res.status(200).send({
        message: 'Authentication successful',
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
        }
    });
})

app.get('/protected-route', (req, res) => {
    // This is a placeholder for a protected route
    res.status.send({
        message: 'This is a protected route. You need to be authenticated to access it.'
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})
