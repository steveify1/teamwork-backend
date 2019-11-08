const { Router } = require('express');
const { signUp } = require('../../controllers/authController');

const router = new Router();

router.post('/create-user', signUp);

module.exports = router;
