const { Router } = require('express');
const {
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleComments,
  deleteArticleComment,
} = require('../../controllers/articleController');

const router = Router();

router.route('/')
  .post(createArticle);

router.route('/:articleId')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

// router.route('/:articleId/comments')
//   .get(getArticleComments);

// router.route('/:articleId/comments')
//   .delete(deleteArticleComment);

module.exports = router;
