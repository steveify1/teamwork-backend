const { Pool } = require('pg');

const {
  PG_USER,
  PG_PASS,
  PG_HOST,
  PG_PORT,
  PG_DB,
} = process.env;

const localConnectionString = `postgres://${PG_USER}:${PG_PASS}@${PG_HOST}:${PG_PORT}/${PG_DB}`;
const ssl = process.env.NODE_ENV === 'production';

// The Database Setup
const pgClient = new Pool({
  connectionString: process.env.DATABASE_URL || localConnectionString,
  ssl: ssl,
});

pgClient.on('error', (e) => console.log(`Unable to connect to Postgres server./ See below.\n${e}`));

pgClient.on('connect', (client) => console.log(`Successfully connected to the ${client.database} database`));

module.exports = pgClient;
