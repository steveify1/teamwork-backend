require('dotenv').config();

/**
 * This logs errors into the console when the app's environment
 * is set to 'development'
 */
class consoleLogger {
  static log({ stack, message }) {
    console.log('state');
    // if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    // console.log('');
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log(message);
    // console.log('--- Stack Trace ------------------------');
    // console.log(stack);
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log('');
    // }
  }
}

module.exports = consoleLogger;
