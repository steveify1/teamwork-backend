const globalSpec = require('./index.spec');
const request = require('../utils/requests');

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

  beforeAll((done) => {
    request(method, endpoint, validEntries, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.message).toBe('User account successfully created');
      done();
    });
  });

  it('should return a 404 status code when firstName is less than 2 characters', (done) => {
    request(method, endpoint, invalidFirstName, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Firstname and lastname must contain at least 2 characters');
      done();
    });
  });

  it('should return a 404 status code when lastName is less than 2 characters', (done) => {
    request(method, endpoint, invalidLastName, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Firstname and lastname must contain at least 2 characters');
      done();
    });
  });

  it('should return a 400 status when at least on field is not sent', (done) => {
    request(method, endpoint, missingRequiredField, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Missing required field(s)');
      done();
    });
  });

  it('should return a 400 status when the email already exists', (done) => {
    request(method, endpoint, emailExists, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Email already exists');
      done();
    });
  });

  it('should return a 400 status when password and confirmPassword don\'t match', (done) => {
    request(method, endpoint, passwordMismatch, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Passwords don\'t match');
      done();
    });
  });

  it('should return a JWT signed token when the user account is successfully created', (done) => {
    request(method, endpoint, validEntries2, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.token).not.toBeUndefined();
    });
    done();
  });
});
