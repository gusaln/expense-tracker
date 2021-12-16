const { dirname, join } = require("path");
require("dotenv").config({ path: join(dirname(__dirname), ".env") });

const connection = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_DB,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

const migrations = {
  directory: join(dirname(__dirname), "migrations"),
};

const seeds = {
  directory: join(dirname(__dirname), "seeds"),
};

module.exports.development = {
  client: "pg",
  connection,
  migrations,
  seeds,
  pool: {
    min: 2,
    max: 10,
  },
};

module.exports.production = {
  client: "pg",
  connection,
  migrations,
  seeds,
  pool: {
    min: 2,
    max: 10,
  },
};
