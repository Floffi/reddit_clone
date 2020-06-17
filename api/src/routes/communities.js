const { Router } = require('express');
const communities = require('../controllers/communities');
const protect = require('../middlewares/protect');
const community = require('../middlewares/community');

const router = Router();

router.get('/:search?', communities.read);
router.use(protect);
router.post('/', communities.create);
router.route('/:community_id').patch(community, communities.update).delete(community, communities.delete);

module.exports = router;