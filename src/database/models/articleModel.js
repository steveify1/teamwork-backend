const slugify = require('slugify');
const Model = require('./model');

class Article extends Model {
  constructor() {
    super('articles');
  }

  // create a new article
  async create(data) {
    const query = `
      INSERT INTO ${this.relation}
      (title, article, slug, tags, author_id, timestamp)
      values ($1, $2, $3, $4, $5, $6) RETURNING id, title, slug, article, tags, author_id, timestamp`;

    // check for article tags
    let tags = { values: [] };
    if (data.tags) {
      tags = data.tags.values && data.tags.values.length ? data.tags : tags;
    }

    const values = [
      data.title,
      data.article,
      slugify.default(data.title).toLowerCase(),
      tags,
      data.userId,
      new Date(),
    ];

    // execute the query
    try {
      const { rows } = await this.DB.query(query, values);
      return rows[0];
    } catch (error) {
      return `Unable to create article::: ${error}`;
    }
  }
}

module.exports = new Article();
