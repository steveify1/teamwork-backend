const fs = require('fs');
const request = require('request');
const globalSpec = require('./index.spec');
const requests = require('../utils/requests');
const pgCLient = require('../config/db');

const {
  authorAccount,
  commentData,
} = require('./mockData/commentMock');

globalSpec('Comments', () => {
  const headers = { token: '' };
  const gifData = {
    title: 'title',
    image: fs.createReadStream(`${__dirname}/mockData/staticFiles/sample.gif`),
  };

  // create a user before anything else
  beforeAll(async (done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
    requests('post', '/api/v1/auth/create-user', {}, authorAccount, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      /* store the user's token. It will be sent in the headers of
      the requests to the article endpoint.
      */
      headers.token = body.data.token;
      done();
    });
  });

  afterAll(async (done) => {
    await pgCLient.query('TRUNCATE gifs, users');
    done();
  });


  // Creating a new comment
  describe('POST /api/v1/gifs/:gifId/comments', () => {
    const method = 'post';
    let endpoint;

    beforeAll((done) => {
      // create a new post first
      request.post({
        uri: 'http://127.0.0.1:3000/api/v1/gifs',
        headers,
        formData: gifData,
      }, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        body = JSON.parse(body);
        console.log(body);

        // add the gif ID to the main endpoint point to make endpoint 2
        endpoint = `/api/v1/gifs/${body.data.gifId}/comments`;
        console.log(endpoint);
        done();
      });
    });

    it('should return a 201 status code if comment is posted successfully', (done) => {
      requests(method, endpoint, headers, commentData, (error, response, body) => {
        console.log(body);
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        expect(body.data.comment).toBeDefined();
        expect(body.data.message).toBe('comment successfully created');
        done();
      });
    });

    it('should return a 400 status code if comment is not supplied', (done) => {
      requests(method, endpoint, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Please provide a comment');
        done();
      });
    });

    it('should return a 400 status code if gif does not exist', (done) => {
      requests(method, '/api/v1/gifs/2728/comments', headers, { comment: 'not found' }, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Oops! Gif does not exist');
        done();
      });
    });
  });
});
