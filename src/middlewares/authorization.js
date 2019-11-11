const { verifyToken } = require('../services/authService');
const sendResponse = require('../utils/sendResponse');

module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // verify that the token header is defined and not empty
    if (!token) { throw new Error('Please, sign up or log in to your account.'); }

    // check that the value of the authorixation header is of type string
    if (typeof token !== 'string') { throw new Error('Invalid token'); }

    // verify that the client's token is not empty

    // verify the client's token with JWT
    const { id } = await verifyToken(token);

    // attach the client's id to the Request body object and move to the next middleware
    req.body.userId = id;
    next();
  } catch ({ message }) {
    sendResponse(res, 401, 'error', message);
  }
};
