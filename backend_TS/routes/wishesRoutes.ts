import {Router} from 'express';
const router = Router();

import auth from '../auth/auth.js';

import createWish from '../controllers/createWish.js';
import updateWish from '../controllers/updateWish.js';
import deleteWish from '../controllers/deleteWish.js';

router.post('/newWish', auth, createWish);
router.put('/updateWish', auth, updateWish);
router.delete('/deleteWish', auth, deleteWish);

export default router;