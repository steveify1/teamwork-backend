require('dotenv').config();
const app = require('./app');
const runMigrations = require('./database/migrations');

// Set App Server Port
app.set('PORT', process.env.PORT || 8000);
app.set('HOST', process.env.HOST || '127.0.0.1');

// Exposing the HTTP server object
module.exports = app.listen(app.get('PORT'), app.get('HOST'), async () => {
  await runMigrations();
  console.log(`Server is up and running on port ${app.get('PORT')}`);
});
