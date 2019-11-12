const Schema = require('./schema');

module.exports = Schema('articles', () => `
    CREATE TABLE IF NOT EXISTS 
    articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR UNIQUE NOT NULL,
    article TEXT NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    tags JSON,
    author_id INTEGER REFERENCES users(id),
    _timestamp VARCHAR NOT NULL);
`);
