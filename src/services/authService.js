require('dotenv').config();
const { promisify } = require('util');
const { sign, verify } = require('jsonwebtoken');

exports.generateToken = (payload) => sign(payload, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

// Asynchronously validates the token and returns the decoded payload used to generate the token
exports.verifyToken = async (token) => await promisify(verify)(token, process.env.JWT_SECRET);
