const keyMapper = require('../services/keyMapper');
const data = require('./mockData/keyMapperMock');

// Testing the key Mapper
describe('keyMapper', () => {
  it('should reject the promise if the arrayOfObject argument is not an array', (done) => {
    expectAsync(keyMapper(undefined, { name: 'steve' })).toBeRejected();
    done();
  });

  it('should resolve the promise if the arrayOfObjects argument is really an array', (done) => {
    expectAsync(keyMapper(data, { author_id: 'authorId' })).toBeResolved();
    done();
  });
});
