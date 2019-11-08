const { Router } = require('express');
const { signUp, login } = require('../../controllers/authController');

const router = new Router();

router.post('/create-user', signUp);

router.post('/signin', login);

module.exports = router;
