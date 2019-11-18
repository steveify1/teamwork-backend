const { Router } = require('express');
const {
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  postComment,
  getByCategory,
} = require('../../controllers/articleController');

const router = Router();

router.route('/')
  .post(createArticle)
  .get(getByCategory);

router.route('/:articleId')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

router.route('/:articleId/comments')
  .post(postComment);

// router.route('/:articleId/comments')
//   .delete(deleteArticleComment);

module.exports = router;
