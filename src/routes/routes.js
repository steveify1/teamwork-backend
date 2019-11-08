const { Router } = require('express');

/**
 * *** Import API versions ***
 */
const apiV1 = require('./apiV1/entry');

/**
 * *** Creating an express Router object.
 */
const router = new Router();

/**
 * Routing based on the API version used by the client.
 * So far, there is only one API version - the LEGACY version.
 */
router.use('v1', apiV1);

module.exports = router;
