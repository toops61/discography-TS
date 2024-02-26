import {Router} from 'express';
const router = Router();

import auth from '../auth/auth';

import createWish from '../controllers/createWish';
import updateWish from '../controllers/updateWish';
import deleteWish from '../controllers/deleteWish';

router.post('/newWish', auth, createWish);
router.put('/updateWish', auth, updateWish);
router.delete('/deleteWish', auth, deleteWish);

export default router;