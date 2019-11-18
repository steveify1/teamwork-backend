const globalSpec = require('./index.spec');
const request = require('../utils/requests');
const pgCLient = require('../config/db');

const {
  authorAccount,
  authorAccount2,
  completeArticleData,
  completeArticleData2,
  completeArticleData3,
  completeArticleData4,
  completeArticleData5,
  completeArticleData6,
  completeArticleUpdate,
  noArticleTitle,
  noArticleBody,
  invalidArticleBody,
  noArticleTags,
  unavailableTag,
} = require('./mockData/articlesMock');

globalSpec('Articles', () => {
  const headers = { token: '' };
  const emptyToken = { token: '' };
  const malformedToken = { token: 'helloeteb234' };
  const invalidToken = {
    token: '',
  };

  beforeAll((done) => {
    request('post', '/api/v1/auth/create-user', {}, authorAccount, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      /* store the user's token. It will be sent in the headers of
      the requests to the article endpoint.
      */
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
    const endpoint = '/api/v1/articles';

    beforeAll((done) => {
      // create a new post
      request('post', '/api/v1/articles', headers, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        expect(body.data.articleId).toBeDefined();
        expect(body.data.message).toBe('Article successfully posted');
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
      request(method, endpoint, headers, completeArticleData, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article title must be unique');
        done();
      });
    });

    it('should return an empty value for the article category if no category are supplied', (done) => {
      request(method, endpoint, headers, noArticleTags, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        expect(body.data.category).toBeUndefined();
        done();
      });
    });

    it('should return a 400 status code if the category supplied does not exist in the categories table', (done) => {
      request(method, endpoint, headers, unavailableTag, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
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


  // GET SINGLE ARTICLE
  describe('GET /api/v1/articles/:id', () => {
    const method = 'get';
    let endpoint;

    beforeAll((done) => {
      // Create an article to be utilized by the rest of the suite.
      request('post', '/api/v1/articles', headers, completeArticleData5, (error, response, body) => {
        // insert the article id into the endpoint
        endpoint = `/api/v1/articles/${body.data.articleId}`;
        done();
      });
    });

    it('should return a 200 status code if article is returned successfully', (done) => {
      request(method, endpoint, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        expect(body.status).toBe('success');
        expect(body.data.id).toBeDefined();
        done();
      });
    });

    it('should return a 400 status code if article id is invalid', (done) => {
      request(method, '/api/v1/articles/hello', headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article identifier malformed');
        done();
      });
    });

    it('should return a 404 status code if article does not exist', (done) => {
      request(method, '/api/v1/articles/999999', headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Oops! Article does not exist');
        done();
      });
    });

    it('should return 401 status code if no `token` header is supplied', (done) => {
      request(method, endpoint, null, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return 401 status code if the bearer token is empty', (done) => {
      request(method, endpoint, emptyToken, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return a 401 status code if the bearer token is invalid', (done) => {
      request(method, endpoint, invalidToken, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('invalid signature');
        done();
      });
    });

    it('should return a 400 status code if the bearer token is not of type string', (done) => {
      request(method, endpoint, malformedToken, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('jwt malformed');
        done();
      });
    });
  });


  // UPADATING AN ARTICLE
  describe('PATCH /api/v1/articles/:id', () => {
    const method = 'patch';
    let endpoint;

    /* post ID. This will be generated by the 'create article'
    test and used by the other method's tests */

    beforeAll((done) => {
      // Create an article to be utilized by the rest of the suite.
      request('post', '/api/v1/articles', headers, completeArticleData2, (error, response, body) => {
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        expect(body.data.articleId).toBeDefined();

        // insert the article id into the endpoint
        endpoint = `/api/v1/articles/${body.data.articleId}`;
        done();
      });
    });

    it('should return a 202 status code if the article is successfully updated', (done) => {
      request(method, endpoint, headers, completeArticleUpdate, (error, response, body) => {
        expect(response.statusCode).toEqual(202);
        expect(body.status).toBe('success');
        expect(body.data.message).toBe('Article successfully updated');
        expect(body.data.title).toBeDefined();
        done();
      });
    });

    it('should return a 400 status code if article id is invalid', (done) => {
      request(method, '/api/v1/articles/hello', headers, noArticleTitle, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article identifier malformed');
        done();
      });
    });

    it('should return a 404 status code if article does not exist', (done) => {
      request(method, '/api/v1/articles/999999', headers, completeArticleData2, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Oops! The article you want to update seems to missing');
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

    it('should return 401 status code if no `token` header is supplied', (done) => {
      request(method, endpoint, null, completeArticleData2, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return 401 status code if the bearer token is empty', (done) => {
      request(method, endpoint, emptyToken, completeArticleData2, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return a 401 status code if the bearer token is invalid', (done) => {
      request(method, endpoint, invalidToken, completeArticleData2, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('invalid signature');
        done();
      });
    });

    it('should return a 400 status code if the bearer token is not of type string', (done) => {
      request(method, endpoint, malformedToken, completeArticleData2, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('jwt malformed');
        done();
      });
    });
  });


  // DELETE ARTICLE
  describe('DELETE /api/v1/articles/:id', () => {
    const method = 'delete';
    let endpoint;
    let endpoint2;
    const headers2 = {};

    beforeAll((done) => {
      request('post', '/api/v1/auth/create-user', null, authorAccount2, (e, r, b) => {
        expect(r.statusCode).toEqual(201);
        /* store the user's token. It will be sent in the headers of
        the requests to the article endpoint.
        */
        headers2.token = b.data.token;
        headers2.userId = b.data.userId;

        // Create an article to be utilized by the rest of the suite.
        request('post', '/api/v1/articles', headers, completeArticleData3, (error, response, body) => {
          // insert the article id into the endpoint
          endpoint = `/api/v1/articles/${body.data.articleId}`;

          // create another article by the same user
          request('post', '/api/v1/articles', headers, completeArticleData4, (err, res, bd) => {
            // insert the article id into the endpoint
            endpoint2 = `/api/v1/articles/${bd.data.articleId}`;
            done();
          });
        });
      });
    });

    it('should return a 401 status code if the user is not authorized to delete the post', (done) => {
      request(method, endpoint2, headers2, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.status).toBe('error');
        expect(body.error).toBe('You don\'t have permissions to delete this post');
        done();
      });
    });

    it('should return a 202 status code if the post is successfully deleted', (done) => {
      request(method, endpoint, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(202);
        expect(body.status).toBe('success');
        expect(body.data.message).toBe('Article successfully deleted');
        done();
      });
    });

    it('should return a 400 status code if article id is invalid', (done) => {
      request(method, '/api/v1/articles/hello', headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(400);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Article identifier malformed');
        done();
      });
    });

    it('should return a 404 status code if article does not exist', (done) => {
      request(method, '/api/v1/articles/999999', headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        expect(body.error).toBe('Oops! The article you want to delete seems to missing');
        done();
      });
    });

    it('should return 401 status code if no `token` header is supplied', (done) => {
      request(method, endpoint, null, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return 401 status code if the bearer token is empty', (done) => {
      request(method, endpoint, emptyToken, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('Please, sign up or log in to your account.');
        done();
      });
    });

    it('should return a 401 status code if the bearer token is invalid', (done) => {
      request(method, endpoint, invalidToken, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('invalid signature');
        done();
      });
    });

    it('should return a 400 status code if the bearer token is not of type string', (done) => {
      request(method, endpoint, malformedToken, null, (error, response, body) => {
        expect(response.statusCode).toEqual(401);
        expect(body.error).toBe('jwt malformed');
        done();
      });
    });
  });

  // GET ARTICLES BY CATEGORY
  describe('GET /api/v1/articles?tag=<category>', () => {
    const method = 'get';
    const endpoint = '/api/v1/articles';

    beforeAll((done) => {
      // Create an article to be utilized by the rest of the suite.
      request('post', endpoint, headers, completeArticleData6, (error, response, body) => {
        // insert the article id into the endpoint
        expect(response.statusCode).toEqual(201);
        expect(body.status).toBe('success');
        done();
      });
    });

    it('should return a 200 status code if articles are returned successfully', (done) => {
      // 'finance' is a default category in the categories table in the database of the application
      request(method, `${endpoint}?tag=finance`, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        expect(body.status).toBe('success');
        done();
      });
    });

    it('should return a 200 status code if the category exists, but there is currently no article in that category', (done) => {
      // 'research' is a default category in the categories table in the database of the application
      request(method, `${endpoint}?tag=research`, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(200);
        expect(body.status).toBe('success');
        done();
      });
    });

    it('should return a 400 status code if the selected category does not exist in the category table', (done) => {
      // 'aaaa' is not a default category in the categories table in the database of the application
      request(method, `${endpoint}?tag=aaaa`, headers, null, (error, response, body) => {
        expect(response.statusCode).toEqual(404);
        expect(body.status).toBe('error');
        done();
      });
    });
  });
});
