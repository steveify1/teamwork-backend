const slugify = require('slugify');
const globalSpec = require('./index.spec');
const request = require('../utils/requests');
const pgCLient = require('../config/db');

const {
  authorAccount,
  completeArticleData,
  noArticleTitle,
  noArticleBody,
  invalidArticleBody,
  duplicateArticleTitle,
  noArticleTags,
} = require('./mockData/articlesMock');

globalSpec('Articles', () => {
  const endpoint = '/api/v1/articles';
  const headers = { token: '' };
  const emptyToken = { token: '' };
  const malformedToken = { token: 'helloeteb234' };
  const invalidToken = {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6
    IkpXVCJ9.eyJpZCI6MTUwLCJfdGltZXN0YW1wIjoiTW9uIE5vd
    iAxMSAyMDE5IDEyOjE3OjI5IEdNVCswMTAwIChXZXN0IEFmcmljYSBTdGF
    uZGFyZCBUaW1lKSIsImlhdCI6MTU3MzQ3MTA1MiwiZXhwIjoxNTc2MDYzMDUyfQ
    .ddDjCxfYE9V9OY1yDs-0vF2LqrSmhzze0rd8NPDoYNy`,
  };

  beforeAll((done) => {
    request('post', '/api/v1/auth/create-user', {}, authorAccount, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.message).toBe('User account successfully created');
      /* store the user's token. It will be sent in the headers of
      the requests to the article endpoint.
      */
      // eslint-disable-next-line prefer-destructuring
      // const { token } = body.data.token;
      headers.token = body.data.token;
      invalidToken.token = body.data.token.slice(0, -1);
      done();
    });
  });

  afterAll(async (done) => {
    await pgCLient.query('TRUNCATE articles, users');
    done();
  });

  // Creating a new post
  describe('POST /api/v1/articles', () => {
    const method = 'post';
    beforeAll((done) => {
      request(method, endpoint, headers, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        expect(body.data.articleId).toBeDefined();
        expect(body.data.message).toBe('Article successfully posted');
        expect(body.data.slug).toBe(slugify(completeArticleData.title).toLowerCase());
        done();
      });
    });

    it('should return a 400 status code if article title is not supplied', (done) => {
      request(method, endpoint, headers, noArticleTitle, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Missing article title');
        done();
      });
    });

    it('should return a 400 status code if article body is not supplied', (done) => {
      request(method, endpoint, headers, noArticleBody, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Missing article body');
        done();
      });
    });

    it('should return a 400 status code if the article body is less than 20 characters', (done) => {
      request(method, endpoint, headers, invalidArticleBody, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article body must be greater than 20 characters');
        done();
      });
    });

    it('should return a 400 status code if the article title is not unique', (done) => {
      request(method, endpoint, headers, duplicateArticleTitle, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article title must be unique');
        done();
      });
    });

    it('should return an empty value for the article tags if no tags are supplied', (done) => {
      request(method, endpoint, headers, noArticleTags, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        expect(body.data.tags.values.length).toBe(0);
        done();
      });
    });

    it('should return 401 status code if no `token` header is supplied', (done) => {
      request(method, endpoint, null, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return 401 status code if the bearer token is empty', (done) => {
      request(method, endpoint, emptyToken, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return a 401 status code if the bearer token is invalid', (done) => {
      request(method, endpoint, invalidToken, completeArticleData, (error, response, body) => {
        console.log(error);
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('invalid signature');
        done();
      });
    });

    it('should return a 400 status code if the bearer token is not of type string', (done) => {
      request(method, endpoint, malformedToken, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('jwt malformed');
        done();
      });
    });
  });
});
