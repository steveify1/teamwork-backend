const consoleLogger = require('./consoleLogger');

// Puts asynchronous functions into a try/catch block
const catchAsync = async (callback) => {
  try {
    return await callback();
  } catch (error) {
    consoleLogger(error);
  }
};

module.exports = catchAsync;
