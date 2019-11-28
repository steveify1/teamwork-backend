/* eslint-disable camelcase */
const Article = require('../database/models/articleModel');
const Comment = require('../database/models/commentModel');
const User = require('../database/models/userModel');
const Category = require('../database/models/categoryModel');
const ResponseError = require('../utils/responseError');
const sendResponse = require('../utils/sendResponse');
const consoleLogger = require('../utils/consoleLogger');
const keyMapper = require('../services/keyMapper');

exports.getArticle = async (req, res) => {
  const { articleId } = req.params;
  try {
    // check that the article id is valid
    if (!Number.parseInt(articleId, 10)) { throw new ResponseError(400, 'Article identifier malformed'); }

    // check if the article exists and return it with its associated comments
    const { rowCount, rows } = await Article.findById(articleId);

    if (!rowCount) { throw new ResponseError(404, 'Oops! Article does not exist'); }

    // get comments
    const commentQuery = `SELECT users.id, firstname, lastname, avatar, c.comment, c._timestamp FROM comments as c 
      INNER JOIN users ON c.author_id=users.id WHERE post_id=$1;`;
    let comments = await Comment.custom(commentQuery, [rows[0].id]).exec();

    comments = await keyMapper(comments.rows, {
      id: 'authorId',
      firstname: 'firstName',
      lastname: 'lastName',
      _timestamp: 'createdOn',
    });

    // if there is no error and execution reaches this point..
    const data = rows[0];
    sendResponse(res, 200, 'success', {
      id: data.id,
      title: data.title,
      article: data.article,
      createdOn: data.timestamp,
      comments: comments,
    }, null);
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};

// CREATE A NEW ARTICLE
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

    // check if the category exists in request body
    const { category } = clientData;
    if (category) {
      // check if category exists in db
      const isCategory = await Category.findByProps({ category });
      if (!isCategory.rowCount) {
        throw new ResponseError(400, 'Selected category is unavailable');
      }
      clientData.categoryId = isCategory.rows[0].id;
    }

    // if everything else is good, post data to db
    const {
      id,
      title,
      article,
      slug,
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
  const { articleId } = req.params;

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

    // check if the article exists
    const isArticle = await Article.findById(articleId);

    if (!isArticle.rowCount) { throw new ResponseError(404, 'Oops! The article you want to update seems to missing'); }

    // ****** if everything else is good, post data to db ******

    // extract the necessary data from client's data. Can't trust the client
    const { title, article, category_id } = clientData;

    // update the article
    const { rows, rowCount } = await Article.updateById(articleId, { title, article, category_id });

    if (!rowCount) { throw new ResponseError(500, 'Oops! Unable to update article. Please, try again'); }

    const result = rows[0];
    // send success response
    sendResponse(res, 202, 'success', {
      message: 'Article successfully updated',
      articleId: result.id,
      title: result.title,
      article: result.article,
      slug: result.slug,
      authorId: result.author_id,
      createdOn: result.timestamp,
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};


// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    // check if the article id is valid
    if (!Number.parseInt(articleId, 10)) { throw new ResponseError(400, 'Article identifier malformed'); }

    // check the article table if the given article exists
    const { rowCount, rows } = await Article.findById(articleId);

    if (!rowCount) { throw new ResponseError(404, 'Oops! The article you want to delete seems to missing'); }

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

// Post Comments
exports.postComment = async (req, res) => {
  const clientData = req.body;
  const { articleId } = req.params;
  try {
    // check that the comment is not empty
    if (!clientData.comment) { throw new ResponseError(400, 'Please provide a comment'); }

    // check that article exists
    const isArticle = await Article.findById(articleId);

    if (isArticle.rowCount === 0) { throw new ResponseError(404, 'Oops! Article does not exist'); }

    // post comment
    const result = await Comment.create({
      postId: articleId,
      comment: clientData.comment,
      userId: clientData.userId,
    });

    const {
      article,
      title,
    } = isArticle.rows[0];

    const {
      comment,
      _timestamp,
    } = result[0];

    // Get comment author
    const authorQuery = 'SELECT id, firstname, lastname, avatar FROM users WHERE id=$1';
    let author = await User.custom(authorQuery, [clientData.userId]).exec();
    author = await keyMapper(author.rows, {
      id: 'authorId',
      firstname: 'firstName',
      lastname: 'lastName',
    });

    // send response
    sendResponse(res, 201, 'success', {
      message: 'Comment successfully created',
      articleTitle: title,
      article,
      comment,
      createdOn: _timestamp,
      ...author[0],
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};

// GET ARTICLE BY CATEGORY
exports.getByCategory = async (req, res) => {
  const { tag } = req.query;
  try {
    // check if category exists
    const { rowCount, rows } = await Category.findByProps({ category: tag });
    if (!rowCount) { throw new ResponseError(404, 'Selected category is unavailable'); }

    // get articles in the selected category
    const result = await Article.findByProps({ category_id: rows[0].id });

    // check if there is an existing article in the selected category
    if (!result.rowCount) {
      return sendResponse(res, 200, 'success', {
        message: 'There is currently no article in selected category',
      });
    }

    // Map result using keyMapper
    const articles = await keyMapper(result.rows, {
      author_id: 'authorId',
      category_id: 'categoryId',
      timestamp: 'createdOn',
    });

    // send list of articles
    sendResponse(res, 200, 'success', articles);
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};
