// This is the global test config file
// It should be imported and reused in every other test file
const request = require("request");;

/**
 * This holds all the global configurations that may apply to all the tests
 * for this application. It runs all the tests using some globally defined parameters like
 * baseUrl and the request library for HTTP requests
 * 
 * @param  { String } testName - the name of the top level describe function that holds the entire test suite
 * @param { Function } testSuite - the top level callback that is normally passed to the describe function. However, this callback needs two parameters: 
 * @request used for sending http requests
 * @baseUrl the base url(protocol + hostname + port) of the target server to send the http request
 *      
 */
module.exports = (testName, testSuite) => {
    describe(("Server"), () => {
        let server;
        const baseUrl = "http://127.0.0.1:3000";
    
        beforeAll(() => {
            server = require("../server").server;
        });
    
        afterAll(() => {
            server.close();
        });
    
        // Your test code goes here
        describe(testName, () => testSuite(request, baseUrl));
    });
};