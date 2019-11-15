const Schema = require('./schema');

module.exports = Schema('gifs', () => `
    CREATE TABLE IF NOT EXISTS 
    gifs (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    image_url VARCHAR,
    author_id INTEGER NOT NULL,
    _timestamp VARCHAR NOT NULL);
`);
