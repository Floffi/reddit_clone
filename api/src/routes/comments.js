const { Router } = require('express');
const comments = require('../controllers/comments');
const protect = require('../middlewares/protect');
const post = require('../middlewares/post');
const comment = require('../middlewares/comment');

const router = Router();

router.get('/post/:post_id', post, comments.readPostComments);
router.use(protect);
router.route('/').post(comments.create);
router.route('/:comment_id').patch(comment, comments.update).delete(comment, comments.delete);

module.exports = router;