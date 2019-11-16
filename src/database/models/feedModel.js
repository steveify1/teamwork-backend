const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class Comment extends Model {
  constructor() {
    super('feeds');
  }

  // create a new comments
  async feeds() {
    const articleQuery = `
      SELECT *
      FROM articles
      ORDER BY timestamp
      LIMIT 10;`;

    const gifQuery = `
      SELECT *
      FROM gifs
      ORDER BY timestamp
      LIMIT 10;`;

    // execute the query
    try {
      const articles = await this.DB.query(articleQuery, []);
      const gifs = await this.DB.query(gifQuery, []);
      return [...articles.rows, ...gifs.rows];
    } catch (error) {
      consoleLogger.log(error);
      return `Unable to get results::: ${error}`;
    }
  }
}

module.exports = new Comment();
