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
    title: 'title 2',
    image: fs.createReadStream(`${__dirname}/mockData/staticFiles/sample.gif`),
  };

  const gifData3 = {
    title: 'title 3',
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


  // Creating a new gif
  describe('POST /api/v1/gifs', () => {
    it('should return a 201 status code if gif is posted successfully', (done) => {
      request.post({
        uri: endpoint,
        headers,
        formData: gifData2,
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
  });

  // GET A GIF
  describe('GET /api/v1/gifs', () => {
    let endpoint2;
    const method = 'get';

    beforeAll((done) => {
      request.post({
        uri: endpoint,
        headers,
        formData: gifData,
      }, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        body = JSON.parse(body);
        console.log(body);

        // add the gif ID to the main endpoint point to make endpoint 2
        endpoint2 = `${endpoint}/${body.data.gifId}`;
        console.log(endpoint2);
        done();
      });
    });

    it('should return a 200 status code if the get request is successful', (done) => {
      requests(method, endpoint2, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        expect(body.status).toBe('success');
        done();
      });
    });

    it('should return a 404 status code if the gif is not found', (done) => {
      requests(method, `${endpoint}/232`, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.error).toBe('Oops! gif does not exist');
        done();
      });
    });

    it('should return a 400 status code if the gif id is invalid', (done) => {
      requests(method, `${endpoint}/jsuiere232`, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.error).toBe('gif identifier malformed');
        done();
      });
    });
  });


  // DELETE ARTICLE
  describe('DELETE /api/v1/gifs/:id', () => {
    const method = 'delete';
    let endpoint1;

    beforeAll((done) => {
      // Create a gif to be utilized by the rest of the suite.
      request.post({
        uri: endpoint,
        headers,
        formData: gifData3,
      }, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        body = JSON.parse(body);
        console.log(body);

        // add the gif ID to the main endpoint point to make endpoint 2
        endpoint1 = `${endpoint}/${body.data.gifId}`;
        done();
      });
    });

    it('should return a 202 status code if the post is successfully deleted', (done) => {
      requests(method, endpoint1, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(202);
        expect(body.status).toBe('success');
        expect(body.data.message).toBe('Gif post successfully deleted');
        done();
      });
    });

    it('should return a 400 status code if article id is invalid', (done) => {
      requests(method, '/api/v1/gifs/hello', headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Gif identifier malformed');
        done();
      });
    });

    it('should return a 404 status code if gif does not exist', (done) => {
      requests(method, '/api/v1/gifs/9999', headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Oops! The gif you want to delete seems to missing');
        done();
      });
    });

    it('should return 401 status code if no `token` header is supplied', (done) => {
      requests(method, endpoint1, null, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });
  });
});
