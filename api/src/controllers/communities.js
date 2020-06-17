const catchAsync = require('../utilities/catchAsync');
const database = require('../database');
const AppError = require('../utilities/appError');


exports.create = catchAsync(async (req, res, _next) => {
  const { name } = req.body;
  // Check whether community name is already taken.
  const resultName = await database('communities').select().where({ name });
  // If we found community with name, return error.
  if (resultName.length > 0) {
    return res.json({
      status: 'failure',
      error: {
        name: 'Name is already taken'
      }
    })
  };
  // Create new community.
  const results = await database('communities').insert({ user_id: req.user.id, name }, '*');
  res.status(201).json({
    status: 'success',
    data: {
      community: results[0],
    }
  })
})

exports.read = catchAsync(async (req, res, _next) => {
  const { search } = req.params;
  // Save the base query in constant.
  const query = database('communities').select();
  // If we have 'search' param, chain another method to query.
  const results = await (search ? query.where('name', 'like', `%${search}%`) : query)
  res.json({
    status: 'success',
    data: {
      communities: results,
    }
  })
})

exports.update = catchAsync(async (req, res, next) => {
  const { community_id } = req.params;
  const { name } = req.body;
  // Check whether user is allowed to update community.
  const resultAllowed = await database('communities').select().where({ id: community_id, user_id: req.user.id });
  // If no community found, return error.
  if (!resultAllowed.length) {
    throw new AppError('Unauthorized access', 401);
  }
  // Update community.
  const results = await database('communities').update({ name }, '*').update('updated_at', database.fn.now()).where('id', community_id);
  res.json({
    status: 'success',
    data: {
      community: results[0],
    }
  })
})

exports.delete = catchAsync(async (req, res, _next) => {
  const { community_id } = req.params;
  // Check whether user is allowed to delete community.
  const resultAllowed = await database('communities').select().where({ id: community_id, user_id: req.user.id });
  // If no community found, return error.
  if (!resultAllowed) {
    throw new AppError('Unauthorized access', 401);
  };
  await database('communities').del().where('id', community_id);
  res.json({
    status: 'success',
    message: 'Community successfully deleted'
  })
})