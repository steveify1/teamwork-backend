const bcrypt = require('bcryptjs');
const User = require('../database/models/userModel');
const { generateToken } = require('../services/authService');
const { hasEmptyField } = require('../utils/customValidators');
const consoleLogger = require('../utils/consoleLogger');
const ResponseError = require('../utils/responseError');

const sendResponse = require('../utils/sendResponse');

exports.signUp = async (req, res) => {
  const clientData = req.body;

  try {
    // check if user submitted data
    if (hasEmptyField(clientData)) { throw new ResponseError(400, 'Missing required field(s)'); }

    // check if user email already exists in the db
    const emailExists = await User.emailExists(clientData.email);
    if (emailExists.rowCount) { return sendResponse(res, 400, 'error', 'Email already exists'); }

    // check that name must be at least 2 characters
    if (clientData.firstName.length < 2 || clientData.lastName.length < 2) {
      throw new ResponseError(400, 'Firstname and lastname must contain at least 2 characters');
    }

    // check if the user password and confirmPassword match
    if (clientData.password !== clientData.confirmPassword) {
      throw new ResponseError(400, 'Passwords don\'t match');
    }

    // create the user
    User.create(clientData)
      .then((obj) => {
        const {
          id,
          firstname,
          avatar,
          _timestamp,
        } = obj;

        // gnerate token
        const token = generateToken({ id, _timestamp });

        sendResponse(res, 201, 'success', {
          message: 'User account successfully created',
          token,
          userId: id,
          firstName: firstname,
          avatar,
        });
      }).catch((error) => sendResponse(res, 400, 'error', 'Email already exists'));
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};


exports.login = async (req, res) => {
  const clientData = req.body;

  try {
    // check if email field is supplied
    if (!clientData.email) { throw new ResponseError(400, 'Missing email field'); }

    // check if passowrd field is supplied
    if (!clientData.password) { throw new ResponseError(400, 'Missing password field'); }

    // check if email exists an return associated row from the database if email exists
    const { rowCount, rows } = await User.emailExists(clientData.email);
    if (!rowCount) { throw new ResponseError(401, 'Email and password don\'t match'); }

    // extract necessary user information from returned table row
    const {
      id,
      firstname,
      _timestamp,
      password,
    } = rows[0];

    // check if client password matches password from the database
    const passwordConfirmed = await bcrypt.compare(clientData.password, password);
    if (!passwordConfirmed) { throw new ResponseError(401, 'Email and password don\'t match'); }

    // generate user token
    const token = generateToken({ id, _timestamp });

    // send token and success status to log the user into app
    sendResponse(res, 202, 'success', {
      token: token,
      userId: id,
      firstName: firstname,
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};
