const dotenv = require('dotenv').config();
const app = require('./app');

// Set App Server Port
app.set("PORT", process.env.PORT || 3000);

// Exposing the HTTP server object
module.exports.server = app.listen(app.get("PORT"), "127.0.0.1", () => {
    console.log(`Server is up and running on port ${app.get("PORT")}`);
});
