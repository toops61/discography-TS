import {Router} from 'express';
const router = Router();

import auth from '../auth/auth';

import createDisc from '../controllers/createDisc';
import updateDisc from '../controllers/updateDisc';
import deleteDisc from '../controllers/deleteDisc';

router.post('/newDisc', auth, createDisc);
router.put('/updateDisc', auth, updateDisc);
router.delete('/deleteDisc', auth, deleteDisc);

export default router;