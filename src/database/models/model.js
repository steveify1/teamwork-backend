/* eslint-disable class-methods-use-this */
const Mechanics = require('./mechanics');

class Model extends Mechanics {
  constructor(relation) {
    super(relation);

    // this will be sent back to theclient
    this.response = {};
  }

  // create() {
  //   // set opereation
  //   this.setOperation('create');
  // }

  find(props, projection) {
    // set opereation
    this.setOperation('find');

    // set projection
    this.setProjection(projection);
    // set restrictionString and value
    this.where(props);
    return this;
  }

  update(identifier, props) {
    // set opereation
    this.setOperation('update');

    this.setUpdateFields(props);

    this.where(identifier);
    return this;
  }

  delete(prop) {
    // set opereation
    this.setOperation('delete');

    this.where(prop);
    return this;
  }

  /* ***** where CHAIN ***** */

  where(props) {
    this.chain.where = true;
    // set restrictionString and value
    if (props) {
      this.setRestriction(props);
    }
    return this;
  }

  /* ***** limit CHAIN ***** */
  limit(limit) {
    this.chain.limit = true;
    // set limit
    this.setLimit(limit);
    return this;
  }

  composeLimit() {
    const limit = this.rowsLimit.map((l, i) => `$${this.numItemsInValues + i + 1}`).join(' ');
    // update the 'this.values' array
    this.setValues(this.rowsLimit);
    return `LIMIT ${limit}`;
  }

  // sets row limit. Expects 'limit' argument to be an array of at most 2 values
  setLimit(limit) {
    const { length } = limit;
    if (!length || length > 2) { throw new Error('array must contain at most 2 values'); }
    if (length === 1) { this.rowsLimit[1] = limit[0]; }
    if (length === 2) {
      this.rowsLimit[0] = limit[0];
      this.rowsLimit[1] = limit[1];
    }

    this.limitString = this.composeLimit();
  }

  /* ***** groupBy CHAIN ***** */
  groupBy(prop) {
    this.chain.group = true;
    this.groupByString = `GROUP BY $${this.numItemsInValues + 1}`;
    // update the 'this.values' array
    this.setValues([prop]);
    return this;
  }

  /* ***** groupBy CHAIN ***** */
  /* 'prop' can be a string or an object where its key reps a table attribute
  // and its value is the order(i.e ASC or DESC). If 'prop' is a string, it reps
  // a table attribute, and this time the function falls back to use the DESC order
  */
  orderBy(prop) {
    this.chain.order = true;
    this.orderByString = this.composeOrderBy(prop);
    return this;
  }

  composeOrderBy(prop) {
    let composition = '';

    // check if 'prop' is passed as an object
    if (prop instanceof Object) {
      const entries = Object.entries(prop)[0];

      // push each of the user's values in the 'this.values' array
      entries.forEach((key, i) => {
        i += 1;
        composition += ` $${this.numItemsInValues + i}`;
      });

      // update the 'this.values' array
      this.setValues(entries);
    } else {
      composition = ` $${this.numItemsInValues + 1} DESC`;
      // update the 'this.values' array
      this.setValues([prop]);
    }

    return `ORDER BY${composition}`;
  }

  // This executes the query and returns a response
  async exec() {
    try {
      // generate queryString
      this.buildQuery();
      // eslint-disable-next-line prefer-destructuring
      const values = this.values;
      // eslint-disable-next-line prefer-destructuring
      const queryString = this.queryString;

      // send query to database
      const { rows, rowCount } = await this.DB.query(queryString, values);

      // end the transaction!
      this.end(); // This resets all properties in this class (except `this.relation`);

      // send a response
      return {
        queryString,
        values,
        rows,
        rowCount,
      };
    } catch (error) {
      console.log(error.stack, error.message);
      return `Unable to complete this transaction: ${error}`;
    }
  }

  async findById(id, projection) {
    try {
      if (!id) { throw new Error('id must be given'); }
      return await this.findByProps({ id }, projection);
    } catch ({ message }) {
      return `Unable to fetch object: ${message}`;
    }
  }

  async findByProps(props, projection) {
    try {
      if (!props || typeof props !== 'object') { throw new Error('no attribute provided'); }

      if (!Object.keys(props).length) { throw new Error('no attribute provided'); }

      this.find(props, projection);
      return await this.exec();
    } catch ({ message }) {
      return `Unable to fetch object: ${message}`;
    }
  }

  // update a row in a relation
  async updateById(id, props) {
    try {
      if (!id) { throw new Error('id must be given'); }

      if (!props || typeof props !== 'object') { throw new Error('no attribute provided'); }

      if (!Object.keys(props).length) { throw new Error('no attribute provided'); }

      // create prepared statement
      this.update({ id }, props);

      // execute the query
      return await this.exec();
    } catch ({ stack, message }) {
      console.log(stack, message);
      return `Unable to fetch object: ${message}`;
    }
  }
}

module.exports = Model;

// const article = new Model('users');
