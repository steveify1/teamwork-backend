require('dotenv').config();
const app = require('./app');
const runMigrations = require('./database/migrations');

// Set App Server Port
app.set('PORT', process.env.PORT || 3000);

// Exposing the HTTP server object
module.exports = app.listen(app.get('PORT'), '0.0.0.0', async () => {
  await runMigrations();
  console.log(`Server is up and running on port ${app.get('PORT')}`);
});
