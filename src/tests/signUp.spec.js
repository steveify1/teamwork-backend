const globalSpec = require('./index.spec');
const request = require('../utils/requests');
const pgClient = require('../config/db');

const {
  validEntries,
  validEntries2,
  invalidFirstName,
  invalidLastName,
  emailExists,
  missingRequiredField,
  passwordMismatch,
} = require('./mockData/signUpMock');

globalSpec('POST /auth/signup', () => {
  const endpoint = '/api/v1/auth/create-user';
  const method = 'post';
  const headers = null;

  beforeAll((done) => {
    request(method, endpoint, headers, validEntries, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.message).toBe('User account successfully created');
      done();
    });
  });

  afterAll(async (done) => {
    await pgClient.query('TRUNCATE users;');
    done();
  });

  it('should return a 404 status code when firstName is less than 2 characters', (done) => {
    request(method, endpoint, headers, invalidFirstName, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Firstname and lastname must contain at least 2 characters');
      done();
    });
  });

  it('should return a 404 status code when lastName is less than 2 characters', (done) => {
    request(method, endpoint, headers, invalidLastName, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Firstname and lastname must contain at least 2 characters');
      done();
    });
  });

  it('should return a 400 status when at least on field is not sent', (done) => {
    request(method, endpoint, headers, missingRequiredField, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Missing required field(s)');
      done();
    });
  });

  it('should return a 400 status when the email already exists', (done) => {
    request(method, endpoint, headers, emailExists, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Email already exists');
      done();
    });
  });

  it('should return a 400 status when password and confirmPassword don\'t match', (done) => {
    request(method, endpoint, headers, passwordMismatch, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Passwords don\'t match');
      done();
    });
  });

  it('should return a JWT signed token when the user account is successfully created', (done) => {
    request(method, endpoint, headers, validEntries2, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.token).not.toBeUndefined();
    });
    done();
  });
});
