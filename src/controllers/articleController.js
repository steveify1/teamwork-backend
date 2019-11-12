/* eslint-disable camelcase */
const Article = require('../database/models/articleModel');
const sendResponse = require('../utils/sendResponse');

exports.createArticle = async (req, res) => {
  const clientData = req.body;

  try {
    // check that the article title is not empty
    if (!clientData.title) { throw new Error('Missing article title'); }

    // check that the artcile body is not empty
    if (!clientData.article) { throw new Error('Missing article body'); }

    // check that the article body contains more that 30 characters
    if (clientData.article.length < 20) {
      throw new Error('Article body must be greater than 20 characters');
    }

    // check if the article title already exists in the articles table
    const { rowCount } = await Article.findByProps({ title: clientData.title });
    if (rowCount) { throw new Error('Article title must be unique'); }

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
  } catch ({ message }) {
    sendResponse(res, 400, 'error', message);
  }
};


exports.updateArticle = async (req, res) => {
  const clientData = req.body;

  try {
    // check that the article title is not empty
    if (!clientData.title) { throw new Error('Missing article title'); }

    // check that the artcile body is not empty
    if (!clientData.article) { throw new Error('Missing article body'); }

    // check that the article body contains more that 30 characters
    if (clientData.article.length < 20) {
      throw new Error('Article body must be greater than 20 characters');
    }

    // check if the article title already exists in the articles table
    const { rowCount } = await Article.findByProps({ title: clientData.title });
    if (rowCount) { throw new Error('Article title must be unique'); }

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
  } catch ({ message }) {
    sendResponse(res, 400, 'error', message);
  }
};
