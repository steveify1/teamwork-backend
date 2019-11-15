/**
 * This sends a response to the client
 * @param { string || object } data - data to be sent back to the client
 */
module.exports = (res, statusCode, status, data) => {
  // if the error was raised my an unhandled part our application, set statusCode to 500
  const code = statusCode || 500;

  if (status === 'success') {
    res.status(code).json({
      status: status,
      data: data,
    });
  } else {
    res.status(code).json({
      status: status,
      error: data,
    });
  }
};
