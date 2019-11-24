const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
// const cors = require('./middlewares/cors');
const routes = require('./routes/routes');


// Application initializing
const app = express();

// Enable CORS
app.use(cors);

// Debugging with morgan
app.use(morgan());

// GLOBAL MIDDLEWARE
// Security Header
app.use(helmet());

// Rate Limiter for requests from same IP
const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Please try again in an hour',
});

app.use('/api', limiter);

// XSS Clean
app.use(xss());

// Compress Text
app.use(compression());

// Parsing JSON and adding a "body" property to the "Request" object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes
app.use('/api', routes);

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'It looks like you hit the wrong route!',
  });
});

module.exports = app;
