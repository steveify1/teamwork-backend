const request = require('request');
const globalSpec = require('./index.spec');

globalSpec('Unknown route', () => {
  it('should return a status code of 404 if the route is not found', (done) => {
    request.get('http://127.0.0.1:3000/', (error, response, body) => {
      body = JSON.parse(body);
      expect(response.statusCode).toEqual(404);
      expect(body.status).toBe('error');
      done();
    });
  });
});
