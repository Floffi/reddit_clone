const jwt = require('jsonwebtoken');
const catchAsync = require('../utilities/catchAsync');
const database = require('../database');
const AppError = require('../utilities/appError');

exports.create = catchAsync(async (req, res, _next) => {
  console.log('User', req.user);
  const { community_id } = req.body;
  // Check whether community with id exists.
  const communityResults = await database('communities')
    .select()
    .where('id', community_id);
  // If no community with ID found, return error.
  if (!communityResults.length) {
    throw new AppError('Community with ID not found', 422);
  }
  // Create new post.
  const results = await database('posts').insert(
    { user_id: req.user.id, ...req.body },
    '*'
  );
  const post = results[0];
  res.json({
    status: 'success',
    data: {
      post,
    },
  });
});

exports.readOne = catchAsync(async (req, res, _next) => {
  const { post_id } = req.params;
  const results = await database('posts').select().where('id', post_id);
  if (!results.length) {
    throw new AppError('Invalid Post ID', 422);
  }
  res.json({
    status: 'success',
    data: {
      post: results[0],
    },
  });
});

exports.read = catchAsync(async (req, res, _next) => {
  const { community_name } = req.params;
  const { authorization } = req.headers;
  const accessToken = authorization.split(' ')[1];
  const { userId } = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  let results;
  let query = database('posts')
    .select(
      'posts.*',
      'communities.name as community_name',
      'users.name as user_name',
      'x.upvotes',
      'y.direction as vote'
    )
    .leftJoin('communities', 'posts.community_id', 'communities.id')
    .leftJoin('users', 'posts.user_id', 'users.id')
    .leftJoin(
      database('post_votes')
        .select(
          'post_id',
          database.raw(
            'SUM(CASE WHEN direction THEN 1 ELSE -1 END)::int AS upvotes'
          )
        )
        .groupBy('post_id')
        .as('x'),
      'x.post_id',
      'posts.id'
    );

  if (community_name) {
    // Check whether community with id exists.
    const communityResults = await database('communities')
      .select()
      .where('name', 'ilike', community_name);
    if (!communityResults.length) {
      throw new AppError('Community with name not found', 422);
    }
    const community = communityResults[0];
    query = query.where('community_id', community.id);
  }

  if (authorization && accessToken && userId) {
    results = await query.leftJoin(
      database('post_votes')
        .select('post_id', 'direction')
        .where('user_id', userId)
        .as('y'),
      'posts.id',
      'y.post_id'
    );
    console.log('MOO');
  } else {
    results = await query;
  }
  console.log('Results', results);

  res.json({
    status: 'success',
    data: {
      posts: results,
    },
  });
});

exports.update = catchAsync(async (req, res, _next) => {
  const results = await database('posts')
    .update(req.body)
    .update('updated_at', database.fn.now())
    .where('id', req.params.post_id)
    .returning('*');
  res.json({
    status: 'success',
    data: {
      post: results[0],
    },
  });
});

exports.vote = catchAsync(async (req, res, _next) => {
  const { post_id } = req.params;
  const { direction } = req.body;
  // Check if user already voted for post.
  const voteResult = await database('post_votes')
    .select()
    .where({ user_id: req.user.id, post_id });
  // User already voted for the post.
  if (voteResult.length) {
    const vote = voteResult[0];
    // If the user already voted in the same direction before, remove the vote.
    if (vote.direction === direction) {
      const results = await database('post_votes')
        .del()
        .where({ post_id, user_id: req.user.id })
        .returning('*');
      res.json({
        status: 'success',
        data: {
          action: 'delete',
          vote: results[0],
        },
      });
    } else {
      // If the user already voted in the opposite direction, update vote to new direction.
      const results = await database('post_votes')
        .update({ direction }, '*')
        .where({ post_id, user_id: req.user.id });
      res.json({
        status: 'success',
        data: {
          action: 'update',
          vote: results[0],
        },
      });
    }
  } else {
    // No post vote found, Create new one.
    const results = await database('post_votes').insert(
      { post_id, user_id: req.user.id, direction },
      '*'
    );
    res.json({
      status: 'success',
      data: {
        action: 'create',
        vote: results[0],
      },
    });
  }
});
