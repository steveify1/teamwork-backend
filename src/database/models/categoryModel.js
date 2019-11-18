const Model = require('./model');
const consoleLogger = require('../../utils/consoleLogger');

class Category extends Model {
  constructor() {
    super('categories');
  }

  // populates the table
  async populate() {
    const { rowCount } = await this.findByProps({ category: 'finance' });
    // populates a table only if it empty
    if (!rowCount) {
      const query = `
      INSERT INTO ${this.relation}
      (category)
      values ($1), ($2), ($3), ($4);`;

      const values = [
        'analytics',
        'finance',
        'research',
        'communication',
      ];

      // execute the query
      try {
        await this.DB.query(query, values);
        console.log(`'${this.relation}' table successfully populated`);
      } catch (error) {
        consoleLogger.log(error);
        return `Unable to create category::: ${error}`;
      }
    }
  }
}

module.exports = new Category();
