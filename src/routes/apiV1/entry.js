const { Router } = require('express');
const auth = require('../../middlewares/authorization');

// Importing endpoints to application resources
const authRoute = require('./authRoute');
const articleRoute = require('./articleRoute');
const gifRoute = require('./gifRoute');
const feedRoute = require('./feedRoute');

const router = Router();

// Login/Register Router
router.use('/auth', authRoute);

// Article Route
router.use('/articles', auth, articleRoute);

// Gif Route
router.use('/gifs', auth, gifRoute);

// Feeds Route
router.use('/feed', auth, feedRoute);
router.use('/feeds', auth, feedRoute);

// Exposing API version
module.exports = router;
