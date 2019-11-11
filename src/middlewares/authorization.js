const { verifyToken } = require('../services/authService');
const sendResponse = require('../utils/sendResponse');

module.exports = async (req, res, next) => {
  const notLoggedInMessage = 'Please, sign up or log in to your account.';
  let token = '';

  // verify that the authorization header is defined
  if (!req.headers.authorization) {
    return sendResponse(res, 401, 'error', notLoggedInMessage);
  }

  // extract the client's token from authorization header
  token = req.headers.authorization.split(' ')[1];

  // verify that the client's token is not empty
  if (!token) { return sendResponse(res, 401, 'error', notLoggedInMessage); }

  try {
    // verify the client's token with JWT
    const { id } = await verifyToken(token);

    // attach the client's id to the Request body object and move to the next middleware
    req.body.userId = id;
    next();
  } catch (error) {
    sendResponse(res, 500, 'error', error);
  }
};
