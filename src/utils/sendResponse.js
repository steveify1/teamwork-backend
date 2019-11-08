/**
 * This sends a response to the client
 * @param { string || object } data - data to be sent back to the client
 */
module.exports = (res, statusCode, status, data) => {
  if (status === 'success') {
    res.status(statusCode).json({
      status: status,
      data: data,
    });
  } else {
    res.status(statusCode).json({
      status: status,
      error: data,
    });
  }
};
