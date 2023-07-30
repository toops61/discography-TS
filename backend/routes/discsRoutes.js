const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');

const createDisc = require('../controllers/createDisc');
const updateDisc = require('../controllers/updateDisc');
const deleteDisc = require('../controllers/deleteDisc');
//const displayDiscs = require('../controllers/displayDiscs');

//router.get('/discography', displayDiscs.displayDiscs);
router.post('/newDisc', auth, createDisc.createDisc);
router.put('/updateDisc', auth, updateDisc.updateDisc);
router.delete('/deleteDisc', auth, deleteDisc.deleteDisc);

module.exports = router;