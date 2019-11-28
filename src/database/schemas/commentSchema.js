const Schema = require('./schema');

module.exports = Schema('comments', () => `
    CREATE TABLE IF NOT EXISTS 
    comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    post_type_id INTEGER NOT NULL,
    _timestamp VARCHAR NOT NULL);
`);
