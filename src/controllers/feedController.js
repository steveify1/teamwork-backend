const sendResponse = require('../utils/sendResponse');
const feedModel = require('../database/models/feedModel');
const { sort } = require('../services/feedService');

exports.getAll = async (req, res) => {
  // get feeds
  let feeds = await feedModel.feeds();

  if (feeds.length === 0) {
    return sendResponse(res, 200, 'success', {
      message: 'no post to show',
    });
  }

  // eslint-disable-next-line prefer-arrow-callback
  feeds = await sort(feeds);

  sendResponse(res, 200, 'success', feeds);


  // sendResponse(res, 200, 'success', {
  //   id: data.id,
  //   title: data.title,
  //   imageUrl: data.image_url,
  //   authorId: data.author_id,
  //   createdOn: data.timestamp,
  //   comments: comments.rows,
  // });
};
