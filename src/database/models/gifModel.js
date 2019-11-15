const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class Gif extends Model {
  constructor() {
    super('gifs');
  }

  // create a new comments
  async create(data) {
    const query = `
      INSERT INTO ${this.relation}
      (title, image_url, author_id, _timestamp)
      values ($1, $2, $3, $4) RETURNING id, title, author_id, image_url, _timestamp`;

    const values = [
      data.title,
      data.imageUrl,
      data.userId,
      new Date(),
    ];

    // execute the query
    try {
      return await this.DB.query(query, values);
    } catch (error) {
      consoleLogger.log(error);
      return `Unable to create comment::: ${error}`;
    }
  }
}

module.exports = new Gif();
