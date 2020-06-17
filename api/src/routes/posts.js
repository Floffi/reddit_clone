const { Router } = require('express');
const posts = require('../controllers/posts');
const post = require('../middlewares/post');
const protect = require('../middlewares/protect');

const router = Router();

router.post('/', protect, posts.create);
router.get('/community/:community_name?', posts.read);
router.use(protect);
router.post('/vote/:post_id', post, posts.vote);
router.route('/:post_id').get(post, posts.readOne).patch(post, posts.update);
module.exports = router;
