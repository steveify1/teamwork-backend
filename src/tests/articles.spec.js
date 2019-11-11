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
  const headers = {};
  const auth = {
    bearer: null,
  };

  beforeAll((done) => {
    request('post', '/api/v1/auth/create-user', {}, authorAccount, (error, response, body) => {
      if (error) { return console.log(error); }
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.message).toBe('User account successfully created');
      /* store the user's token. It will be sent in the headers of
      the requests to the article endpoint.
      */
      // eslint-disable-next-line prefer-destructuring
      auth.bearer = body.data.token;
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
        if (error) { return console.log(error); }
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        expect(body.data.articleId).toBeDefined();
        expect(body.data.message).toBe('Article successfully posted');
        expect(body.data.slug).toBe(slugify(completeArticleData.title).toLowerCase());
        done();
      }, auth);
    });

    it('should return a 400 status code if article title is not supplied', (done) => {
      request(method, endpoint, headers, noArticleTitle, (error, response, body) => {
        if (error) { return console.log(error); }
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Missing article title');
        done();
      }, auth);
    });

    it('should return a 400 status code if article body is not supplied', (done) => {
      request(method, endpoint, headers, noArticleBody, (error, response, body) => {
        if (error) { return console.log(error); }
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Missing article body');
        done();
      }, auth);
    });

    it('should return a 400 status code if the article body is less than 20 characters', (done) => {
      request(method, endpoint, headers, invalidArticleBody, (error, response, body) => {
        if (error) { return console.log(error); }
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article body must be greater than 20 characters');
        done();
      }, auth);
    });

    it('should return a 400 status code if the article title is not unique', (done) => {
      request(method, endpoint, headers, duplicateArticleTitle, (error, response, body) => {
        if (error) { return console.log(error); }
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article title must be unique');
        done();
      }, auth);
    });

    it('should return an empty value for the article tags if no tags are supplied', (done) => {
      request(method, endpoint, headers, noArticleTags, (error, response, body) => {
        if (error) { return console.log(error); }
        expect(body.data.tags.values.length).toBe(0);
        done();
      }, auth);
    });
  });
});
