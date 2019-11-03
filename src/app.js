const express = require("express");
const routes = require("./routes/routes");


/// Application initializing
const app = express();

// Debugging with mortar

// Parsing JSON and adding a "body" property to the "Request" object
app.use(express.json());

// Set up routes
app.use("/api", routes);


module.exports = app;