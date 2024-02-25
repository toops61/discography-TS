import {Router} from 'express';
const router = Router();

import createUser from '../controllers/subscribe';
import connectUser from '../controllers/login';

router.post('/subscribe', createUser);
router.post('/login', connectUser);

export default router;