const { Router } = require('express');
const feedController = require('../../controllers/feedController');

const router = Router();

router.get('/', feedController.getAll);


module.exports = router;
