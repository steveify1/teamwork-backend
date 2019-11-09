const bcrypt = require('bcryptjs');
const pgClient = require('../../config/db');

class User {
  constructor() {
    this.relation = 'users';
    this.defaultAvatar = {
      male: 'https://huntpng.com/images250/png-avatar-4.png',
      female: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSrZZcWGdWlk-DnfheLjRO1dM8s7q5GrMf4KMMrdi7os8K6oGeg',
    };
  }

  async create(data) {
    const query = `
        INSERT INTO ${this.relation} 
        (firstname, lastname, email, password, gender, job_role, department, address, avatar, _timestamp) 
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, firstname, avatar, _timestamp;
        `;

    try {
      data.password = await bcrypt.hash(data.password, 10);

      const { rows } = await pgClient.query(query,
        [
          data.firstName.toLowerCase(),
          data.lastName.toLowerCase(),
          data.email.toLowerCase(),
          data.password,
          data.gender.toLowerCase(),
          data.jobRole.toLowerCase(),
          data.department.toLowerCase(),
          data.address,
          this.defaultAvatar[data.gender.toLowerCase()],
          Date(),
        ]);

      return rows[0];
    } catch (e) {
      console.log(e);
    }
  }

  // Checks to confirm that if the user's email exists
  async emailExists(email) {
    const query = `SELECT email, password FROM ${this.relation} WHERE email=$1`;
    try {
      return await pgClient.query(query, [email]);
    } catch (error) {
      console.log(`Unable to fetch object: ${error}`);
    }
  }
}

module.exports = new User();
