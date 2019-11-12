/* eslint-disable class-methods-use-this */
const pgClient = require('../../config/db');

class Model {
  constructor(relation) {
    this.relation = relation;
    this.DB = pgClient;
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

      const { restrictionString, values } = this.getRestriction(props);
      projection = this.getProjection(projection);

      // generate the query string
      const query = `SELECT ${projection} FROM ${this.relation} WHERE ${restrictionString};`;
      console.log(query, values);

      // execute the actual query
      return await this.DB.query(query, values);
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

      const { restrictionString, values } = this.getUpdateRestriction(props);

      // generate query string
      const query = `UPDATE ${this.relation} SET ${restrictionString} WHERE id=$${values.length + 1} RETURNING *;`;

      // execute the query and return data
      return await this.DB.query(query, [...values, id]);
    } catch ({ stack, message }) {
      return `Unable to fetch object: ${message}`;
    }
  }

  // convert the array of projections into a single seperated by a comma, if it's an array
  getProjection(projection) {
    // Checking that projections were supplied - i.e that 'projection' is defined
    return projection && projection.length ? projection.join(', ') : '*';
  }

  // generate the restriction string and corresponding values
  getRestriction(props) {
    const values = [];
    const keys = Object.keys(props);
    let restrictionString = '';

    keys.forEach((key, i) => {
      i += 1;
      if (i > 1) { restrictionString += ' AND '; }
      restrictionString += `${key}=$${i}`;
      values.push(props[key]);
    });

    return {
      restrictionString,
      values,
    };
  }

  getUpdateRestriction(props) {
    const values = [];
    const keys = Object.keys(props);
    let restrictionString = '';

    keys.forEach((key, i) => {
      i += 1;
      if (i > 1) { restrictionString += ', '; }
      restrictionString += `${key}=$${i}`;
      values.push(props[key]);
    });

    return {
      restrictionString,
      values,
    };
  }
}

module.exports = Model;

