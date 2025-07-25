const express = require('express');
const cors = require('cors');

const db = require('./models');
const { PORT } = require('./config/api_config');
const { api_router } = require('./routers/api_router');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1', api_router)

db.sequelize.sync()
  .then((req) => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Example app listening on port ${PORT}!`);
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
