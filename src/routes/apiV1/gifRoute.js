const { Router } = require('express');
const auth = require('../../middlewares/authorization');
const extractFile = require('../../middlewares/extractFile');
const {
  createGif,
  getGif,
  postComment,
} = require('../../controllers/gifController');

const router = Router();

router.route('/')
  .post(extractFile.single('image'), auth, createGif);

router.route('/:gifId')
  .get(getGif);

// router.route('/:gifId/comments')
//   .post(postComment);

module.exports = router;
