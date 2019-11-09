/* eslint-disable class-methods-use-this */
const pgClient = require('../../config/db');

class Model {
  constructor(relation) {
    this.relation = relation;
    this.query = pgClient;
  }

  async findById(id, projection) {
    try {
      return await this.findByProps(id, projection);
    } catch (error) {
      console.log(`Unable to fetch object: ${error}`);
    }
  }

  async findByProps(props, projection) {
    const { restrictionString, values } = this.getRestriction(props);
    projection = this.getProjection(projection);

    // generate the query string
    const query = `SELECT ${projection} FROM ${this.relation} WHERE ${restrictionString};`;

    // execute the actual query
    try {
      return await this.query.query(query, values);
    } catch (error) {
      console.log(`Unable to fetch object: ${error}`);
    }
  }

  // update a row in a relation
  async updateById(id, props) {
    const { restrictionString, values } = this.getRestriction(props);
    // generate query string
    const query = `UPDATE ${this.relation} SET ${restrictionString} WHERE id=${values.length + 1}`;

    try {
      return await this.query.query(query, [...values, id]);
    } catch (error) {
      console.log(`Unable to fetch object: ${error}`);
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
}

module.exports = Model;

