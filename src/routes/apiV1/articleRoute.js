const { Router } = require('express');
const authorization = require('../../middlewares/authorization');
const { createArticle } = require('../../controllers/articleController');

const router = Router();

router.route('/')
  .post(authorization, createArticle);

module.exports = router;
