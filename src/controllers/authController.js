const User = require('../database/models/userModel');
const { generateToken } = require('../services/authService');

exports.signUp = async (req, res) => {
  const userData = req.body;
  const isFieldMissing = () => Object.values(userData).filter((data) => data === '').length;

  try {
    // check if user submitted data
    if (isFieldMissing()) { throw new Error('Missing required field(s)'); }

    // create a service to clean the client data

    // check if user email already exists in the db
    if (await User.emailExists(userData.email)) { throw new Error('Email already exists'); }

    // check that name must be at least 2 characters
    if (userData.firstName.length < 2 || userData.lastName.length < 2) { throw new Error('Firstname and lastname must contain at least 2 characters'); }

    // check if the user password and confirmPassword match
    if (userData.password !== userData.confirmPassword) { throw new Error('Passwords don\'t match'); }

    // create the user
    User.create(userData)
      .then((obj) => {
        const {
          id,
          firstname,
          avatar,
          _timestamp,
        } = obj;

        // gnerate token
        const token = generateToken({ id, _timestamp });

        res.status(201).json({
          status: 'success',
          data: {
            message: 'User account successfully created',
            token,
            userId: id,
            firstName: firstname,
            avatar,
            _timestamp,
          },
        });
      });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.message,
    });
  }
};
