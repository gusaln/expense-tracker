const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const accountRoutes = require('./accounts');
const categoryRoutes = require('./categories');
const transactionRoutes = require('./transactions');
const incomeRoutes = require('./incomes');
const expenseRoutes = require('./expenses');
const transferRoutes = require('./transfers');
const summaryRoutes = require('./summaries');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/transfers', transferRoutes);
app.use('/api/v1/summaries', summaryRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
