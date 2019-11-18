const globalSpec = require('./index.spec');
const requests = require('../utils/requests');
const pgCLient = require('../config/db');

const {
  authorAccount,
} = require('./mockData/commentMock');

const { completeArticleData } = require('./mockData/articlesMock');

globalSpec('Feeds', () => {
  const headers = { token: '' };
  const endpoint = '/api/v1/feed';
  const method = 'get';
  // const gifData = {
  //   title: 'title',
  //   image: fs.createReadStream(`${__dirname}/mockData/staticFiles/sample.gif`),
  // };

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

  afterEach(async (done) => {
    await pgCLient.query('TRUNCATE gifs, articles');
    done();
  });

  afterAll(async (done) => {
    await pgCLient.query('TRUNCATE gifs, users, articles');
    done();
  });


  describe('Feeds', () => {
    // First create gif and article
    beforeAll((done) => {
      // post article
      requests('post', 'http://127.0.0.1:3000/api/v1/articles', headers, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        console.log(body);
        done();
      });
    });

    it('should return a 201 status code if there at least one gif or article', (done) => {
      requests(method, endpoint, headers, null, (error, response, body) => {
        console.log(body, 'helllllllo');
        expect(response.statusCode).toEqual(200);
        expect(body.status).toBe('success');
        expect(body.data.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  // Creating a new comment
  describe('Feeds', () => {
    it('should return a "no post to show" if there is no gif and article', (done) => {
      requests(method, endpoint, headers, null, (error, response, body) => {
        console.log(body);
        expect(response.statusCode).toEqual(200);
        expect(body.status).toBe('success');
        expect(body.data.message).toBe('no post to show');
        done();
      });
    });
  });
});
