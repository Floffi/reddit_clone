const cookieParser = require('cookie-parser');
const { Router } = require('express');
const auth = require('../controllers/auth');
const protect = require('../middlewares/protect');

const router = Router();

router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/logout', auth.logout);
router.get('/refresh_token', cookieParser(), auth.refreshToken);
router.get('/load_session', protect, auth.loadSession);

module.exports = router;