const sendResponse = require('../utils/sendResponse');
const feedModel = require('../database/models/feedModel');
const keyMapper = require('../services/keyMapper');

exports.getAll = async (req, res) => {
  // get feeds
  const { rowCount, rows } = await feedModel.feeds();

  if (!rowCount) {
    return sendResponse(res, 200, 'success', {
      message: 'no post to show',
    });
  }

  // map the keys correctly
  const feeds = await keyMapper(rows, {
    author_id: 'authorId',
    timestamp: 'createdOn',
    firstname: 'firstName',
    lastname: 'lastName',
  });

  sendResponse(res, 200, 'success', feeds);
};
