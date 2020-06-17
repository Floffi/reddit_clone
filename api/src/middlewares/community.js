const database = require('../database');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

const community = catchAsync(async (req, _res, next) => {
  const { community_id } = req.params;
  if (!community_id) {
    throw new AppError('Community ID not found', 422);
  }
  // Check whether community with id exists.
  const communityResult = await database('communities').select().where('id', community_id);
  if (!communityResult.length) {
    throw new AppError('Community with ID not found', 422);
  };
  next();
})

module.exports = community;