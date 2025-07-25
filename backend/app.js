const express = require('express');
const cors = require('cors');

const db = require('./models');
const { PORT, API_VERSION } = require('./config/api_config');
const { api_router } = require('./routers/api_router');

const app = express();
app.use(express.json());
app.use(cors());
app.use(`/api/${API_VERSION}`, api_router)

db.sequelize.sync()
  .then((req) => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`API ${API_VERSION} listening on port ${PORT}!`);
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
