const { Router } = require('express');
const {
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../../controllers/articleController');

const router = Router();

router.route('/')
  .post(createArticle);

router.route('/:id')
  .patch(updateArticle)
  .delete(deleteArticle);

module.exports = router;
