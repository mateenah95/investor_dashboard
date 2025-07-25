const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');

const db = require('../models');
const { authenticated } = require('../middleware/auth');

const { API_VERSION, 
        JWT_SECRET, 
        JWT_EXPIRY, 
        PAGINATION_PAGE_SIZE
    } = require('../config/api_config');

const api_router = express.Router();

api_router.get('/health', (req, res) => {
    res.status(200).send({
        status: 'Healthy',
        api_version: API_VERSION,
        timestamp: new Date().toLocaleString()
    });
});

api_router.post('/auth', async (req, res) => {
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
        { expiresIn: JWT_EXPIRY }
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
});

api_router.get('/portfolio', authenticated, async (req, res) => {
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

    let portfolioValue = 0;
    let netProfit = 0;

    const group_by_ticker = {};
    const group_by_asset_type_ticker = {
        stocks: {},
        crypto: {}
    };


    transactions.forEach(transaction => {
        if (transaction.transaction_type === 'buy') {
            totalBuys += transaction.quantity * transaction.price;
            if (transaction.type === 'stock') {
                stockBuys += transaction.quantity * transaction.price;
                if(!(transaction.ticker in group_by_asset_type_ticker['stocks'])) {
                    group_by_asset_type_ticker['stocks'][transaction.ticker] = {
                        amount: transaction.quantity * transaction.price,
                    }
                }
                else {
                    group_by_asset_type_ticker['stocks'][transaction.ticker].amount += transaction.quantity * transaction.price;
                }
            }
            else {
                cryptoBuys += transaction.quantity * transaction.price;
                if(!(transaction.ticker in group_by_asset_type_ticker['crypto'])) {
                    group_by_asset_type_ticker['crypto'][transaction.ticker] = {
                        amount: transaction.quantity * transaction.price,
                    }
                }
                else {
                    group_by_asset_type_ticker['crypto'][transaction.ticker].amount += transaction.quantity * transaction.price;
                }
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
                if(!(transaction.ticker in group_by_asset_type_ticker['stocks'])) {
                    group_by_asset_type_ticker['stocks'][transaction.ticker] = {
                        amount: (transaction.quantity * transaction.price) * (-1),
                    }
                }
                else {
                    group_by_asset_type_ticker['stocks'][transaction.ticker].amount -= transaction.quantity * transaction.price;
                }
            }
            else {
                cryptoSells += transaction.quantity * transaction.price;
                if(!(transaction.ticker in group_by_asset_type_ticker['crypto'])) {
                    group_by_asset_type_ticker['crypto'][transaction.ticker] = {
                        amount: (transaction.quantity * transaction.price) * (-1),
                    }
                }
                else {
                    group_by_asset_type_ticker['crypto'][transaction.ticker].amount -= transaction.quantity * transaction.price;
                }
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
    portfolioValue = netInvestment + (netInvestment * 0.12)
    netProfit = portfolioValue - netInvestment;

    const stock_investments_breakdown = [];
    const crypto_investments_breakdown = [];

    for (let stock in group_by_asset_type_ticker['stocks']){
        stock_investments_breakdown.push([stock, group_by_asset_type_ticker['stocks'][stock]['amount']]);
    }

    for (let crypto in group_by_asset_type_ticker['crypto']){
        crypto_investments_breakdown.push([crypto, group_by_asset_type_ticker['crypto'][crypto]['amount']]);
    }
    
    const topStocks = stock_investments_breakdown.sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topCrypto = crypto_investments_breakdown.sort((a, b) => b[1] - a[1]).slice(0, 3);

    const investment_over_time = [
        [2021, 5135],
        [2022, 7121],
        [2023, 12861],
        [2024, 17143],
        [2025, 9822]
    ]
     const investment_over_time_cumulative = [
        [2021, 5135],
        [2022, 12256],
        [2023, 25117],
        [2024, 42260],
        [2025, 52082]
     ]

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
        net_profit: netProfit,
        transaction_count: transactions.length,
        crypto_investments_breakdown: crypto_investments_breakdown,
        stock_investments_breakdown: stock_investments_breakdown,
        top_stock_holdings: topStocks,
        top_crypto_holdings: topCrypto,
        investment_over_time: investment_over_time,
        investment_over_time_cumulative: investment_over_time_cumulative
    };

    res.status(200).send({
        portfolio
    });
});

api_router.get('/transactions', authenticated, async (req, res) => {
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

api_router.get('/reports', authenticated, async (req, res) => {
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

module.exports = {
    api_router
}