import { Router } from 'express';
const router = Router();
import createUser from '../controllers/subscribe.js';
import connectUser from '../controllers/login.js';
router.post('/subscribe', createUser);
router.post('/login', connectUser);
export default router;
