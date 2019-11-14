const pgClient = require('../../config/db');

/**
 * This is the parent class of the 'Model' class.
 * This holds most of the crude algorithms and data structures used by the
 * 'Model' class. Basically, it does most of the heavy liftings
 */
class Mechanics {
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

  // This is used to end the current transaction
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

module.exports = Mechanics;
