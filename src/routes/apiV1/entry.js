const { Router } = require('express');
const authorization = require('../../middlewares/authorization');

// Importing endpoints to application resources
const authRoute = require('./authRoute');
const articleRoute = require('./articleRoute');

const router = Router();

// Login/Register Router
router.use('/auth', authRoute);

// Article Route
router.use('/articles', authorization, articleRoute);

// Exposing API version
module.exports = router;
