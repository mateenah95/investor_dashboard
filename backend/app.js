const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const {Op} = require('sequelize');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 80;
const APP_VERSION = '1.0.0';
const SALT_ROUNDS = 10;
const JWT_SECRET = 'my_jwt_secret';
const PAGINATION_PAGE_SIZE = 10;

const db = require('./models');
const { title } = require('process');

const authenticated = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(400).send('Invalid token.');
        }
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
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(400).send('Invalid token.');
    }
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
        return res.status(404).send({
            error: 'User not found'
        });
    }
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({
            error: 'Invalid password'
        });
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

app.get('/portfolio', authenticated, async (req, res) => {
    const transactions = await db.Transaction.findAll({
        where: { user_id: req.user.id }
    });
    let totalBuys = 0;
    let totalSells = 0;

    let stockBuys = 0;
    let stockSells = 0;

    let cryptoBuys = 0;
    let cryptoSells = 0;

    let netInvestment = 0;
    let netStockInvestment = 0;
    let netCryptoInvestment = 0;

    const group_by_ticker = {};
    const group_by_asset_type = {};

    transactions.forEach(transaction => {
        if (transaction.transaction_type === 'buy') {
            totalBuys += transaction.quantity * transaction.price;
            if (transaction.type === 'stock') {
                stockBuys += transaction.quantity * transaction.price;
            }
            else {
                cryptoBuys += transaction.quantity * transaction.price;
            }
            if(!(transaction.ticker in group_by_ticker)) {
                group_by_ticker[transaction.ticker] = {
                    amount: transaction.quantity * transaction.price,
                }
            }
            else {
                group_by_ticker[transaction.ticker].amount += transaction.quantity * transaction.price;
            }
        }
        else {
            totalSells += transaction.quantity * transaction.price;
            if (transaction.type === 'stock') {
                stockSells += transaction.quantity * transaction.price;
            }
            else {
                cryptoSells += transaction.quantity * transaction.price;
            }
            if(!(transaction.ticker in group_by_ticker)) {
                group_by_ticker[transaction.ticker] = {
                    amount: -(transaction.quantity * transaction.price),
                }
            }
            else {
                group_by_ticker[transaction.ticker].amount -= (transaction.quantity * transaction.price);
            }
        }
    })

    netInvestment = totalBuys - totalSells;
    netStockInvestment = stockBuys - stockSells;
    netCryptoInvestment = cryptoBuys - cryptoSells;

    const portfolio = {
        total_buys: totalBuys,
        total_sells: totalSells,
        crypto_buys: cryptoBuys,
        crypto_sells: cryptoSells,
        stock_buys: stockBuys,
        stock_sells: stockSells,
        total_investment: netInvestment,
        stock_investment: netStockInvestment,
        crypto_investment: netCryptoInvestment,
        transaction_count: transactions.length,
        group_by_ticker: group_by_ticker
    };

    res.status(200).send({
        portfolio
    });
});

app.get('/transactions', authenticated, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : PAGINATION_PAGE_SIZE;
    if (page < 1 || pageSize < 1) {
        return res.status(400).send({
            error: 'Invalid page or page size'
        });
    }
    const {count, rows} = await db.Transaction.findAndCountAll({
        where: { user_id: req.user.id },
        limit: pageSize,
        offset: (page - 1) * pageSize,
        order: [['id', 'DESC']]
    });
    const pageCount = Math.ceil(count / pageSize);
    if (page > pageCount) {
        res.status(404).send({
            error: 'Page not found'
        });
    }
    res.status(200).send({
        transactions: rows,
        page: page,
        pageSize: pageSize,
        pageCount: pageCount,
    });
});

app.get('/reports', authenticated, async (req, res) => {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    if (year > new Date().getFullYear() || year < new Date().getFullYear() - 5) {
        return res.status(400).send({
            error: 'Year cannot be in the future or more than 5 years in the past.'
        });
    }
    const reports = await db.Report.findAll({
        where: { 
            user_id: req.user.id,
            title: {
                [Op.like]: `%${year}%`
            } 
        },
    });
    res.status(200).send({
        reports
    });
}); 

db.sequelize.sync()
  .then((req) => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Example app listening on port ${PORT}!`);
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
