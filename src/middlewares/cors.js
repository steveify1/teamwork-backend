/** This module implements cors be setting special headers to allow
 * other apps talk to our application
*/
const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', ' GET, POST, PUT, PATCH, DELETE');
  next();
};

module.exports = cors;