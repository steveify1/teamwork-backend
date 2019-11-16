const { feeds } = require('./feedServiceMock');
const { sort } = require('../services/feedService');


describe('feedService', () => {
  it('should arrange the objects in the feeds array in desc order', async (done) => {
    const result = await sort(feeds);
    expect(result[0].timestamp).toBeGreaterThanOrEqual(result[1].timestamp);
    done();
  });
});
