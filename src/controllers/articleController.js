/* eslint-disable camelcase */
const Article = require('../database/models/articleModel');
const sendResponse = require('../utils/sendResponse');

exports.createArticle = async (req, res) => {
  const clientData = req.body;
  // check that the article title is not empty
  if (!clientData.title) { return sendResponse(res, 400, 'error', 'Missing article title'); }

  // check that the artcile body is not empty
  if (!clientData.article) { return sendResponse(res, 400, 'error', 'Missing article body'); }

  // check that the article body contains more that 30 characters
  if (clientData.article.length < 20) {
    return sendResponse(res, 400, 'error', 'Article body must be greater than 20 characters');
  }

  // check if the article title exists
  try {
    const { rowCount } = await Article.findByProps({ title: clientData.title });
    if (rowCount) { return sendResponse(res, 400, 'error', 'Article title must be unique'); }

    // if everything else is good, post data to db
    const {
      id,
      title,
      slug,
      article,
      tags,
      author_id,
      _timestamp,
    } = await Article.create(clientData);

    // send success response
    sendResponse(res, 201, 'success', {
      message: 'Article successfully posted',
      articleId: id,
      title,
      article,
      slug,
      tags,
      authorId: author_id,
      createdOn: _timestamp,
    });
  } catch (error) {
    console.log(`An error occured::: ${error}`);
  }
};
