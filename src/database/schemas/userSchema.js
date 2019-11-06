const Schema = require('./schema');

module.exports = Schema('users', () => {
    return `
        CREATE TABLE IF NOT EXISTS 
        users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(25) NOT NULL,
        lastname VARCHAR(25) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        gender VARCHAR(6),
        job_role VARCHAR(20),
        department VARCHAR(20) NOT NULL,
        address VARCHAR NOT NULL,
        avatar VARCHAR NOT NULL,
        _timestamp VARCHAR NOT NULL);`;
})