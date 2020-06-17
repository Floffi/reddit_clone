const database = require('../database');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

const comment = catchAsync(async (req, _res, next) => {
  const { comment_id } = req.params;
  if (!comment_id) {
    throw new AppError('Comment ID not found', 422);
  }
  // Check whether comment with id exists.
  const commentResult = await database('comments').select().where('id', comment_id);
  if (!commentResult.length) {
    throw new AppError('Comment with ID not found', 422);
  };
  next();
})

module.exports = comment;