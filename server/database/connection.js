const { knex } = require('knex');

const knexConfig = require('../config/database');

const connection = knex(knexConfig[process.env.NODE_ENV || 'development']);
// connection.on('query', (ctx) => console.log({ sql: ctx.sql, bindings: ctx.bindings }));

module.exports = connection;
