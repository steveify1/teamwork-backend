// This is the global test config file
// It should be imported and reused in every other test file

require('dotenv').config();
const runMigrations = require('../database/migrations');

/**
 * This holds all the global configurations that may apply to all the tests
 * for this application. It runs all the tests using some globally defined parameters like
 * baseUrl and the request library for HTTP requests
 * @param  { String } testName - the name of the top level describe function
 * that holds the entire test suite
 * @param { Function } testSuite - the top level callback that is normally passed to the describe
 * function. However, this callback needs two parameters:
 * @request used for sending http requests
 * @baseUrl the base url(protocol + hostname + port) of the target server to send the http request
 */

module.exports = (testName, testSuite) => {
  describe(('Server'), () => {
    let server;

    beforeAll((done) => {
      // eslint-disable-next-line global-require
      server = require('../server');
      server.listen('3000', async () => {
        await runMigrations(); // Creates all the database tables based on the schemas
        done();
      });
    });

    afterAll((done) => {
      server.close();
      done();
    });

    // Your test suite runs inside this describe block
    describe(testName, () => testSuite());
  });
};
