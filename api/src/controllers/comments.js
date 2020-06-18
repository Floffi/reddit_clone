const catchAsync = require('../utilities/catchAsync');
const database = require('../database');
const AppError = require('../utilities/appError');

exports.create = catchAsync(async (req, res, _next) => {
  const results = await database('comments').insert(
    { user_id: req.user.id, ...req.body },
    '*'
  );
  res.json({
    status: 'success',
    data: {
      comment: results[0],
    },
  });
});

exports.readPostComments = catchAsync(async (req, res, _next) => {
  const results = await database('comments')
    .select('comments.*', 'users.name as user_name', 'x.upvotes')
    .where('post_id', req.params.post_id)
    .leftJoin('users', 'comments.user_id', 'users.id')
    .leftJoin(
      database('comment_votes')
        .select(
          'comment_id',
          database.raw(
            'SUM(CASE WHEN direction THEN 1 ELSE -1 END)::int AS upvotes'
          )
        )
        .groupBy('comment_id')
        .as('x'),
      'x.comment_id',
      'comments.id'
    );
  res.json({
    status: 'success',
    data: {
      comments: results,
    },
  });
});

exports.vote = catchAsync(async (req, res, _next) => {
  const { comment_id } = req.params;
  const { direction } = req.body;
  // Check whether comment with id exists.
  const commentResult = await database('comments')
    .select()
    .where('id', comment_id);
  if (!commentResult.length) {
    throw new AppError('Comment with ID not found', 422);
  }
  // Check if user already voted for comment.
  const voteResult = await database('comment_votes')
    .select()
    .where({ user_id: req.user.id, comment_id });
  // User already voted for the comment.
  if (voteResult.length) {
    const vote = voteResult[0];
    // If the user already voted in the same direction before, remove the vote.
    if (vote.direction === direction) {
      await database('comment_votes')
        .del()
        .where({ comment_id, user_id: req.user.id });
      res.json({
        status: 'success',
        data: {
          action: 'delete',
        },
      });
    } else {
      // If the user already voted in the opposite direction, update vote to new direction.
      const results = await database('comment_votes')
        .update({ direction }, '*')
        .where({ comment_id, user_id: req.user.id });
      res.json({
        status: 'success',
        data: {
          action: 'update',
          vote: results[0],
        },
      });
    }
  } else {
    // No comment vote found, Create new one.
    const results = await database('comment_votes').insert(
      { comment_id, user_id: req.user.id, direction },
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

exports.update = catchAsync(async (req, res, _next) => {
  const { comment_id } = req.params;
  // Check whether we have comment with ID.
  const commentResults = await database('comments')
    .select()
    .where('id', comment_id);
  // If no comment found, return error.
  if (!commentResults.length) {
    throw new AppError('Comment with ID not found', 422);
  }
  // Update comment.
  const results = await database('comments')
    .update(req.body)
    .update('updated_at', database.fn.now())
    .where('id', comment_id)
    .returning('*');
  res.json({
    status: 'success',
    data: {
      comment: results[0],
    },
  });
});

exports.delete = catchAsync(async (req, res, _next) => {
  const { comment_id } = req.params;
  // Check whether we have comment with ID.
  const commentResults = await database('comments')
    .select()
    .where('id', comment_id);
  // If no comment found, return error.
  if (!commentResults.length) {
    throw new AppError('Comment with ID not found', 422);
  }
  // Instead of deleting comment in database, we just delete 'user_id' and 'text' column content of comment.
  const results = await database('comments').update(
    { user_id: null, text: null },
    '*'
  );
  res.json({
    status: 'success',
    data: {
      comment: results[0],
    },
  });
});
