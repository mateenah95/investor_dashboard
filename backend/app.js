const express = require('express');
const app = express();

const PORT = 3000;
const APP_VERSION = '1.0.0';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/health', (req, res) => {
    res.status(200).send({
        status: 'Healthy',
        api_version: APP_VERSION,
        timestamp: new Date().toISOString()
    });
});

app.get('/protected-route', (req, res) => {
    // This is a placeholder for a protected route
    res.status.send({
        message: 'This is a protected route. You need to be authenticated to access it.'
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})
