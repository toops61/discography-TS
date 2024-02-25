import {Router} from 'express';
const router = Router();

import auth from '../auth/auth.js';

import createDisc from '../controllers/createDisc.js';
import updateDisc from '../controllers/updateDisc.js';
import deleteDisc from '../controllers/deleteDisc.js';

router.post('/newDisc', auth, createDisc);
router.put('/updateDisc', auth, updateDisc);
router.delete('/deleteDisc', auth, deleteDisc);

export default router;