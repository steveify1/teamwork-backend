const Schema = require('./schema');

module.exports = Schema('roles', () => `
    CREATE TABLE IF NOT EXISTS 
    roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR NOT NULL);
`);
