const { Router } = require('express');
const {
  createArticle,
  updateArticle,
} = require('../../controllers/articleController');

const router = Router();

router.route('/')
  .post(createArticle);

router.route('/:id')
  .patch(updateArticle);

module.exports = router;
