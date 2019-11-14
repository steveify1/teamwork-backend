const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class Article extends Model {
  constructor() {
    super('articles');

    this.customString = '';
  }

  // create a new article
  async create(data) {
    const query = `
      INSERT INTO ${this.relation}
      (title, article, category_id, author_id, timestamp)
      values ($1, $2, $3, $4, $5) RETURNING id, title, article, category_id, author_id, timestamp`;

    // check for article tags
    const category = data.categoryId || null;

    const values = [
      data.title,
      data.article,
      category,
      data.userId,
      new Date(),
    ];

    // execute the query
    try {
      const { rows } = await this.DB.query(query, values);
      return rows[0];
    } catch (error) {
      consoleLogger.log(error);
      return `Unable to create article::: ${error}`;
    }
  }

  // returns a single article with all its comments
  async findArticle(id) {
    // check if the article exists nd return it with its associated comments
    this.customString = `SELECT * FROM articles
      INNER JOIN comments
      ON article.id = comments.post_id
      WHERE comments.post_type = articles
      AND articles.id =$1`;
    try {
      return await this.custom(this.customString, [id]);
    } catch (error) {
      consoleLogger.log(error);
      return `Unable to create article::: ${error}`;
    }
  }
}

module.exports = new Article();
