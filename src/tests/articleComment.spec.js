const globalSpec = require('./index.spec');
const request = require('../utils/requests');
const pgCLient = require('../config/db');

const {
  authorAccount,
  completeArticleData,
  commentData,
} = require('./mockData/commentMock');

globalSpec('Comments', () => {
  const headers = { token: '' };

  beforeAll((done) => {
    request('post', '/api/v1/auth/create-user', {}, authorAccount, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      /* store the user's token. It will be sent in the headers of
      the requests to the article endpoint.
      */
      headers.token = body.data.token;
      done();
    });
  });

  afterAll(async (done) => {
    await pgCLient.query('TRUNCATE articles, users');
    done();
  });


  // Creating a new comment
  describe('POST /api/v1/articles/:articleId/comments', () => {
    const method = 'post';
    let endpoint;

    beforeAll((done) => {
      // create a new post first
      request('post', '/api/v1/articles', headers, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(201);

        // store articleId
        // eslint-disable-next-line prefer-destructuring
        endpoint = `/api/v1/articles/${body.data.articleId}/comments`;
        done();
      });
    });

    it('should return a 201 status code if comment is posted successfully', (done) => {
      request(method, endpoint, headers, commentData, (error, response, body) => {
        console.log(body);
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        expect(body.data.comment).toBeDefined();
        expect(body.data.message).toBe('Comment successfully created');
        done();
      });
    });

    it('should return a 400 status code if comment is not supplied', (done) => {
      request(method, endpoint, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Please provide a comment');
        done();
      });
    });

    it('should return a 400 status code if article does not exist', (done) => {
      request(method, '/api/v1/articles/2728/comments', headers, { comment: 'not found' }, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Oops! Article does not exist');
        done();
      });
    });
  });
});
