const fs = require('fs');
const request = require('request');
const requests = require('../utils/requests');
const globalSpec = require('./index.spec');
const pgCLient = require('../config/db');

const {
  authorAccount,
} = require('./mockData/gifMock');

globalSpec('Gifs', () => {
  const headers = { token: '' };
  const endpoint = 'http://127.0.0.1:3000/api/v1/gifs';
  const gifData = {
    title: 'title',
    image: fs.createReadStream(`${__dirname}/mockData/staticFiles/sample.gif`),
  };

  const gifData2 = {
    title: 'title',
    image: fs.createReadStream(`${__dirname}/mockData/staticFiles/sample.gif`),
  };

  const wrongGifImage = {
    title: 'title',
    image: fs.createReadStream(`${__dirname}/mockData/staticFiles/javascript-wallpaper.jpg`),
  };

  const noGifTitle = {
    title: '',
    image: fs.createReadStream(`${__dirname}/mockData/staticFiles/sample.gif`),
  };

  beforeAll(async (done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

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


  // Creating a new gif
  describe('POST /api/v1/gifs', () => {
    it('should return a 201 status code if gif is posted successfully', (done) => {
      request.post({
        uri: endpoint,
        headers,
        formData: gifData,
      }, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        body = JSON.parse(body);
        expect(body.status).toBe('success');
        expect(body.data.message).toBe('Gif image successfully posted');
        done();
      });
    });

    it('should return a 400 status code if gif title is not supplied', (done) => {
      request.post({
        uri: endpoint,
        headers,
        formData: noGifTitle,
      }, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        body = JSON.parse(body);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Missing gif title');
        done();
      });
    });

    it('should return a 400 status code if gif image is wrong', (done) => {
      request.post({
        uri: endpoint,
        headers,
        formData: wrongGifImage,
      }, (error, response, body) => {
        console.log(response.statusCode);
        expect(response.statusCode).toEqual(400);
        body = JSON.parse(body);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Wrong file type. Please, upload a gif image');
        done();
      });
    });

    //   it('should return a 400 status code if article does not exist', (done) => {
    //     request(method, '/api/v1/articles/2728/comments', headers, { comment: 'not found' }, (error, response, body) => {
    //       expect(response.statusCode).toEqual(404);
    //       expect(body.status).toBe('error');
    //       expect(body.error).toBe('Oops! Article does not exist');
    //       done();
    //     });
    //   });
  });
});
