const { Router } = require('express');
const authController = require('../../controllers/authController');

const router = Router();

router.post('/signin', authController.login);

router.post('/create-user', authController.signUp);


module.exports = router;
