require('dotenv').config();

/**
 * This logs errors into the console when the app's environment
 * is set to 'development'
 */
class consoleLogger {
  static log({ name, stack, message }) {
    const env = process.env.NODE_ENV;
    if (env && env === 'development') {
      // eslint-disable-next-line no-console
      console.table([
        name,
        message,
        stack,
      ]);
    }
  }
}

module.exports = consoleLogger;
