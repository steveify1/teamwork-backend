const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class Feed extends Model {
  constructor() {
    super('feeds');
  }

  // returns article and gif posts in descending order
  async feeds() {
    const queryString = `
    SELECT a.id, a.title, a.article AS content, timestamp, a.author_id
    FROM articles AS a
    UNION
    SELECT g.id, g.title, g.image_url AS content, timestamp, g.author_id
    FROM gifs AS g
    ORDER BY timestamp DESC
    LIMIT 20;
    `;

    // execute the query
    try {
      const result = await this.custom(queryString)
        .exec();
      return result;
    } catch (error) {
      consoleLogger.log(error);
      return `Unable to get results::: ${error}`;
    }
  }
}

module.exports = new Feed();
