/* eslint-disable camelcase */
require('../middlewares/cloudinary');
const cloudinary = require('cloudinary');
const Comment = require('../database/models/commentModel');
const User = require('../database/models/userModel');
const Gif = require('../database/models/gifModel');
// const Category = require('../database/models/categoryModel');
const ResponseError = require('../utils/responseError');
const sendResponse = require('../utils/sendResponse');
const consoleLogger = require('../utils/consoleLogger');
const keyMapper = require('../services/keyMapper');

// Get GIF
exports.getGif = async (req, res) => {
  const { gifId } = req.params;
  try {
    // check that the gif id is valid
    if (!Number.parseInt(gifId, 10)) { throw new ResponseError(400, 'gif identifier malformed'); }

    // check if the gif exists and return it with its associated comments
    const { rowCount, rows } = await Gif.findById(gifId);

    if (!rowCount) { throw new ResponseError(404, 'Oops! gif does not exist'); }

    // get comments
    const commentQuery = `SELECT users.id, users.firstname, users.lastname, users.avatar, c.comment, c._timestamp FROM comments as c 
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
      imageUrl: data.image_url,
      authorId: data.author_id,
      createdOn: data.timestamp,
      comments: comments,
    }, null);
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};

// CREATE A NEW GIF
exports.createGif = async (req, res) => {
  const clientData = req.body;
  const { file } = req;
  const ext = file.mimetype.split('/')[1];

  try {
    // check that the gif title is not missing
    if (!clientData.title) {
      throw new ResponseError(400, 'Missing gif title');
    }

    // check file extension
    if (ext !== 'gif') {
      throw new ResponseError(400, 'Wrong file type. Please, upload a gif image');
    }

    // Attempt to upload file
    const upload = await cloudinary.v2.uploader.upload(file.path);

    clientData.imageUrl = upload.secure_url;

    // if everything else is good, post data to db
    let result = await Gif.create(clientData);

    // extract the returned
    result = result.rows[0];


    // send success response
    sendResponse(res, 201, 'success', {
      message: 'Gif image successfully posted',
      gifId: result.id,
      title: result.title,
      imageUrl: result.image_url,
      authorId: result.author_id,
      createdOn: result.timestamp,
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};


// Delete Gif
exports.deleteGif = async (req, res) => {
  try {
    const { gifId } = req.params;
    // check if the gif id is valid
    if (!Number.parseInt(gifId, 10)) { throw new ResponseError(400, 'Gif identifier malformed'); }

    // check the gif table if the given gif exists
    const { rowCount } = await Gif.findById(gifId);

    if (!rowCount) { throw new ResponseError(404, 'Oops! The gif you want to delete seems to missing'); }

    // First attempt to delete gif comments
    await Comment.delete({ post_id: gifId }).exec();

    // delete the post if the above conditions are false and execution reaches here.
    await Gif.deleteById(gifId);

    // send success response to the client
    sendResponse(res, 202, 'success', { message: 'Gif post successfully deleted' });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};


// Post Comments
exports.postComment = async (req, res) => {
  const clientData = req.body;
  const { gifId } = req.params;
  try {
    // check that the comment is not empty
    if (!clientData.comment) { throw new ResponseError(400, 'Please provide a comment'); }

    // check that gif exists
    const isGif = await Gif.findById(gifId);

    if (isGif.rowCount === 0) { throw new ResponseError(404, 'Oops! Gif does not exist'); }

    // post comment
    const result = await Comment.create({
      postId: gifId,
      comment: clientData.comment,
      userId: clientData.userId,
      postTypeId: 1, // post_type_id 1 represents 'gif' posts
    });

    // extract comment data
    const {
      id,
      comment,
      _timestamp,
    } = result[0];

    console.log(result[0]);

    // Get comment author
    const authorQuery = 'SELECT id, firstname, lastname, avatar FROM users WHERE id=$1';
    let author = await User.custom(authorQuery, [clientData.userId]).exec();

    author = await keyMapper(author.rows, {
      id: 'authorId',
      firstname: 'firstName',
      lastname: 'lastName',
    });

    // extract gif data
    const gif = isGif.rows[0];

    // send response
    sendResponse(res, 201, 'success', {
      id,
      message: 'comment successfully created',
      title: gif.title,
      comment,
      createdOn: _timestamp,
      ...author[0],
    });
  } catch (error) {
    consoleLogger.log(error);
    sendResponse(res, error.statusCode, 'error', error.message);
  }
};
