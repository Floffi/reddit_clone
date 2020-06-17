const database = require('../database');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

const post = catchAsync(async (req, _res, next) => {
  const { post_id } = req.params;
  if (!post_id) {
    throw new AppError('Post ID not found', 422);
  }
  // Check whether post with id exists.
  const postResult = await database('posts').select().where('id', post_id);
  if (!postResult.length) {
    throw new AppError('Post with ID not found', 422);
  };
  next();
})

module.exports = post;