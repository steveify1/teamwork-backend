/* eslint-disable class-methods-use-this */
const pgClient = require('../../config/db');

class Model {
  constructor(relation) {
    this.relation = relation;
    this.operation = ''; // This just tells which CRUD operation the user wants to perform.
    this.values = []; // The array of values to be passed to the 'this.DB.query' function.
    this.numItemsInValues = 0; // The number of items in the 'this.values' array
    this.insertFields = '';
    this.updateFields = '';
    this.projectionString = '*'; // If the user makes(or doesn't make) projections
    this.restrictionString = '';
    this.groupByString = ''; // In case the user wants to group the output
    this.orderByString = ''; // In case the user wants to order the output
    this.limitString = '';
    this.toReturnFields = 'RETURNING *';
    this.rowsLimit = [0, ''];
    this.queryString = '';
    this.DB = pgClient;
    this.operator = '=';
    this.operators = {
      '<': ' < ',
      '>': ' > ',
      '<=': '<=',
      '>=': '>=',
      '!': ' != ',
      '=': '=',
    };

    this.chain = {
      where: false,
      group: false,
      order: false,
      limit: false,
      return: false,
    };

    // this will be sent back to theclient
    this.response = {};
  }

  templates() {
    return {
      create: `INSERT INTO ${this.relation} (${this.insertFields}) VALUES (${this.objectValuesString})`,
      find: `SELECT ${this.projectionString} FROM ${this.relation}`,
      update: `UPDATE ${this.relation} SET ${this.updateFields}`,
      delete: `DELETE FROM ${this.relation}`,
    };
  }


  // This sets the current user operation whenever one of the crud operations is called
  setOperation(operation) {
    this.operation = operation;
  }

  // This builds the current query in full and makes the call to execute it
  buildQuery() {
    let query;
    // get the template for the current CRUD operation the user wants to perform
    query = this.templates()[this.operation];

    // ** check which sub actions have been called - check the chain property **
    if (this.chain.where) {
      query += ` ${this.restrictionString}`;
    }

    if (this.chain.group) {
      query += ` ${this.groupByString}`;
    }

    if (this.chain.order) {
      query += ` ${this.orderByString}`;
    }

    if (this.chain.limit) {
      query += ` ${this.limitString}`;
    }

    if (this.operation === 'create' || this.operation === 'update') {
      query += `  ${this.toReturnFields}`;
    }

    // set the final queryString to be executed
    this.queryString = query;
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

  // this check the operator of each value, extracts the operator and returns the actual value
  // it returns the value as is if the value has no user defined operator, and then falls back to
  // the '=' operator
  checkRestrictionOperator(value) {
    // if the value is a string value(say a number or a boolean)
    if (typeof value === 'string') {
      const singleCharOperator = value[0];
      const doubleCharOperator = value.slice(0, 2);

      // if the first two characters are an operator in the 'this.operators' array
      if (doubleCharOperator in this.operators) {
        this.operator = this.operators[doubleCharOperator];
        return value.slice(2);
      }

      // if the first character is an operator in the 'this.operator' array
      if (singleCharOperator in this.operators) {
        this.operator = this.operators[singleCharOperator];
        return value.slice(1);
      }
    }

    return value;
  }

  // generate attribute value
  generator(props, seperator) {
    const values = [];
    const keys = Object.keys(props);
    let composedString = '';
    let currentValue;
    let extractedValue;

    let i = this.numItemsInValues ? (this.numItemsInValues + 1) : 1;
    keys.forEach((key, count) => {
      currentValue = props[key];
      extractedValue = this.checkRestrictionOperator(currentValue);
      if (count > 0) { composedString += seperator; }
      composedString += `${key}${this.operator}$${i}`; // Ex. firstName=$2
      values.push(extractedValue);

      // increase the value of 'i' by one
      i += 1;
    });

    // update the this.values array
    this.setValues(values);

    return {
      composedString,
      values,
    };
  }

  // This fills up the values array in the right order
  setValues(newValues) {
    newValues.forEach((i) => this.values.push(i));
    // update the number of items in the value array
    this.numItemsInValues = this.values.length;
  }

  // generate the restriction string and corresponding values
  setRestriction(props) {
    const { composedString } = this.generator(props, ' AND ');
    this.restrictionString = `WHERE ${composedString}`;
  }

  setUpdateFields(props) {
    const { composedString } = this.generator(props, ', ');
    this.updateFields = composedString;
  }

  // convert the array of projections into a single seperated by a comma, if it's an array
  setProjection(projection) {
    // Checking that projections were supplied - i.e that 'projection' is defined
    // and if 'projection' is not an empty array
    if (!projection || !projection.length) { return; }

    let proj = '';

    let i = this.numItemsInValues + 1;

    projection.forEach((key, count) => {
      if (count > 0 && count < projection.length) { proj += ', '; }
      proj += `$${i}`;
      i += 1;
    });

    // update the 'this.values' array
    this.setValues(projection);

    this.projectionString = proj;
  }

  end() {
    this.restrictionString = '';
    this.limitString = '';
    this.groupByString = '';
    this.orderByString = '';
    this.projectionString = '*';
    this.queryString = '';
    this.numItemsInValues = 0;

    // reset this.operator
    this.operator = '=';

    // reset chains
    Object.keys(this.chain).forEach((i) => {
      this.chain[i] = false;
    });

    // reset values
    this.values = [];

    // clear response
    this.response = '';
  }
}

module.exports = Model;

// const article = new Model('users');
