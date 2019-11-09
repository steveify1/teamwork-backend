const globalSpec = require('./index.spec');
const request = require('../utils/requests');

const {
  initialSignUp,
  validEntries,
  noEmailField,
  noPasswordField,
  nonExistentEmail,
  wrongPassword,
} = require('./mockData/loginMock');

globalSpec('POST /auth/signin', () => {
  const endpoint = '/api/v1/auth/signin';
  const method = 'post';

  beforeAll((done) => {
    request(method, '/api/v1/auth/create-user', initialSignUp, (error, response, body) => {
      expect(response.statusCode).toEqual(201);
      expect(body.status).toBe('success');
      expect(body.data.message).toBe('User account successfully created');
      done();
    });
  });

  it('should return a 202 status code if the user is logged in successfully', (done) => {
    request(method, endpoint, validEntries, (error, response, body) => {
      expect(response.statusCode).toEqual(202);
      expect(body.status).toBe('success');
      expect(body.data.token).not.toBeUndefined();
      done();
    });
  });

  it('should return a 400 status code if email is not supplied', (done) => {
    request(method, endpoint, noEmailField, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Missing email field');
      done();
    });
  });

  it('should return a 400 status code if password is not supplied', (done) => {
    request(method, endpoint, noPasswordField, (error, response, body) => {
      expect(response.statusCode).toEqual(400);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Missing password field');
      done();
    });
  });

  it('should return a 401 status code if email doesn\'t exist', (done) => {
    request(method, endpoint, nonExistentEmail, (error, response, body) => {
      expect(response.statusCode).toBe(401);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Email and password don\'t match');
      done();
    });
  });

  it('should return a 401 status code if password is not correct', (done) => {
    request(method, endpoint, wrongPassword, (error, response, body) => {
      expect(response.statusCode).toEqual(401);
      expect(body.status).toBe('error');
      expect(body.error).toBe('Email and password don\'t match');
      done();
    });
  });
});
