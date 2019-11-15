const { Router } = require('express');
const auth = require('../../middlewares/authorization');

// Importing endpoints to application resources
const authRoute = require('./authRoute');
const articleRoute = require('./articleRoute');
const gifRoute = require('./gifRoute');

const router = Router();

// Login/Register Router
router.use('/auth', authRoute);

// Article Route
router.use('/articles', auth, articleRoute);

// Gif Route
router.use('/gifs', auth, gifRoute);

// Exposing API version
module.exports = router;
