/**
 * This creates new errors witha given status code and error message.
 * It is a sub class of the native Error class
 * @param { string } statusCode - the error or status code
 * @param { string } message - the error message
 * @return { Error Object } - an arror object
 */
class ResponseError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    return this;
  }
}

module.exports = ResponseError;
