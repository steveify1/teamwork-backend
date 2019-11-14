const Schema = require('./schema');

module.exports = Schema('articles', () => `
    CREATE TABLE IF NOT EXISTS 
    articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    article TEXT NOT NULL,
    category_id INTEGER,
    author_id INTEGER,
    timestamp VARCHAR NOT NULL);
`);
