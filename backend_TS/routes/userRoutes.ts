import {Router} from 'express';
const router = Router();

import createUser from '../controllers/subscribe.js';
import connectUser, { disconnectUser } from '../controllers/login.js';

router.post('/subscribe', createUser);
router.post('/login', connectUser);
router.post('/logout', disconnectUser);

export default router;