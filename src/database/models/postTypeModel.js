const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class PostType extends Model {
  constructor() {
    super('post_types');
  }

  // populates the table
  async populate() {
    const { rowCount } = await this.find().exec();
    // populates a table only if it empty
    if (!rowCount) {
      const query = `
      INSERT INTO ${this.relation}
      (post_type)
      values ($1), ($2);`;

      const values = [
        'gif',
        'article',
      ];

      // execute the query
      try {
        await this.DB.query(query, values);
        console.log(`'${this.relation}' table successfully populated`);
      } catch (error) {
        consoleLogger.log(error);
        return `Unable to populate ${this.relation}::: ${error}`;
      }
    }
  }
}

module.exports = new PostType();
