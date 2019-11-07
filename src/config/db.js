
const { Pool } = require("pg");
const { PG_USER, PG_PASS, PG_HOST, PG_PORT, PG_DB } = process.env;

// The Database Setup
const pgClient = new Pool({
    user: PG_USER,
    password: PG_PASS,
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB
});

pgClient.on("error", e => console.log(`Unable to connect to Postgres server./ See below.\n${e}`));
pgClient.on("connect", client => {
    console.log(`Successfully connected to the ${client.database} database`);
});

module.exports = pgClient;