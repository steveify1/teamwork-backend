/* eslint-disable camelcase */
const Article = require('../database/models/articleModel');
const ResponseError = require('../utils/responseError');
const sendResponse = require('../utils/sendResponse');
const consoleLogger = require('../utils/consoleLogger');

exports.createArticle = async (req, res) => {
  const clientData = req.body;

  try {
    // check that the article title is not empty
    if (!clientData.title) { throw new ResponseError(400, 'Missing article title'); }

    // check that the artcile body is not empty
    if (!clientData.article) { throw new ResponseError(400, 'Missing article body'); }

    // check that the article body contains more that 20 characters
    if (clientData.article.length < 21) {
      throw new ResponseError(400, 'Article body must be greater than 20 characters');
    }

    // check if the article title already exists in the articles table
    const { rowCount } = await Article.findByProps({ title: clientData.title });
    if (rowCount) { throw new ResponseError(400, 'Article title must be unique'); }

    // if everything else is good, post data to db
    const {
      id,
      title,
      slug,
      article,
      tags,
      author_id,
      timestamp,
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
      createdOn: timestamp,
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};


exports.updateArticle = async (req, res) => {
  const clientData = req.body;
  const articleId = req.params.id;

  try {
    // check that the article id is valid
    if (!Number.parseInt(articleId, 10)) { throw new ResponseError(400, 'Article identifier malformed'); }

    // check that the article title is not empty
    if (!clientData.title) { throw new ResponseError(400, 'Missing article title'); }

    // check that the artcile body is not empty
    if (!clientData.article) { throw new ResponseError(400, 'Missing article body'); }

    // check that the article body contains more that 20 characters
    if (clientData.article.length < 21) {
      throw new ResponseError(400, 'Article body must be greater than 20 characters');
    }

    // check the article table if the given article exists
    const { rowCount } = await Article.findById(articleId);
    if (!rowCount) { throw new ResponseError(404, 'The article you want to update seems to missing'); }

    // ****** if everything else is good, post data to db ******

    // extract the necessary data from client's data. Can't trust the client
    const { title, article, tags } = clientData;

    // update the article
    const { rows } = await Article.updateById(articleId, { title, article, tags });
    const result = rows[0];
    // send success response
    sendResponse(res, 202, 'success', {
      message: 'Article successfully updated',
      articleId: result.id,
      title: result.title,
      article: result.article,
      slug: result.slug,
      tags: result.slug,
      authorId: result.author_id,
      createdOn: result.timestamp,
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    // check if the article id is valid
    if (!Number.parseInt(articleId, 10)) { throw new ResponseError(400, 'Article identifier malformed'); }

    // check the article table if the given article exists
    const { rowCount, rows } = await Article.findById(articleId);

    if (!rowCount) { throw new ResponseError(404, 'The article you want to delete seems to missing'); }

    const { userId } = req.body;

    // check that the user id is the same as the article author id before permitting delete
    if (rows[0].author_id !== userId) { throw new ResponseError(401, 'You don\'t have permissions to delete this post'); }

    // delete the post if the above conditions are false and execution reaches here.
    await Article.deleteById(articleId);

    // send success response to the client
    sendResponse(res, 202, 'success', { message: 'Article successfully deleted' });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};
