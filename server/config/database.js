// Update with your config settings.
require('dotenv').config({ path: '../.env' });

const connection = {
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DB,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
};

const migrations = {
  directory: '../migrations'
};

const seeds = {
  directory: '../seeds'
};

module.exports = {
  production: {
    client: 'pg',
    connection,
    migrations,
    seeds
  },

  development: {
    client: 'pg',
    connection,
    migrations,
    seeds
  },
};
