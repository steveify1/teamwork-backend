const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require("./routes/routes");


/// Application initializing
const app = express();

// Debugging with morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan());
}

// Parsing JSON and adding a "body" property to the "Request" object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Set up routes
app.use("/api", routes);


module.exports = app;