const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class Comment extends Model {
  constructor() {
    super('comments');
  }

  // create a new comments
  async create(data) {
    const query = `
      INSERT INTO ${this.relation}
      (comment, post_id, author_id, _timestamp)
      values ($1, $2, $3, $4) RETURNING id, comment, post_id, author_id, _timestamp`;

    const values = [
      data.comment,
      data.postId,
      data.userId,
      new Date(),
    ];

    // execute the query
    try {
      const { rows } = await this.DB.query(query, values);
      return rows;
    } catch (error) {
      consoleLogger.log(error);
      return `Unable to create comment::: ${error}`;
    }
  }
}

module.exports = new Comment();
