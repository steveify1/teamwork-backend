require('dotenv').config();

/**
 * This logs errors into the console when the app's environment
 * is set to 'development'
 */
class consoleLogger {
  static log({ stack, message }) {
    if (process.env.NODE_ENV === 'development' && process.env.CONSOLE_LOGS) {
      // eslint-disable-next-line no-console
      console.log('');
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log(message);
      console.log('--- Stack Trace ------------------------');
      console.log(stack);
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log('');
    }
  }
}

module.exports = consoleLogger;
