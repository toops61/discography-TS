const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');
//const multer = require('../middleware/multer-config');

const createUser = require('../controllers/subscribe');
const connectUser = require('../controllers/login');

router.post('/subscribe', createUser.createUser);
router.post('/login', connectUser.connectUser);

module.exports = router;