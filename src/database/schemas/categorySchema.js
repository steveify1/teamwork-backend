const Schema = require('./schema');

module.exports = Schema('categories', () => `
    CREATE TABLE IF NOT EXISTS 
    categories (
    id SERIAL PRIMARY KEY,
    category VARCHAR NOT NULL);
`);
