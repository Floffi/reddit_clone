const { Router } = require('express');
const auth = require('./auth');
const posts = require('./posts');
const communities = require('./communities');
const comments = require('./comments');

const router = Router();

router.use('/auth', auth);
router.use('/communities', communities);
router.use('/posts', posts);
router.use('/comments', comments);

module.exports = router;