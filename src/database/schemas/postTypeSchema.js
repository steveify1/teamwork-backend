const Schema = require('./schema');

module.exports = Schema('post_types', () => `
    CREATE TABLE IF NOT EXISTS 
    post_types (
    id SERIAL PRIMARY KEY,
    post_type VARCHAR NOT NULL);
`);
