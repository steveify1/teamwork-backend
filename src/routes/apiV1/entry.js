const { Router } = require('express');

// Importing endpoints to application resources
const authRoute = require('./authRoute');

const router = new Router();

// Login/Register Router
router.use('/auth', authRoute);


// Exposing API version
module.exports = router;
