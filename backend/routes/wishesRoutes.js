const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');

const createWish = require('../controllers/createWish');
const updateWish = require('../controllers/updateWish');
const deleteWish = require('../controllers/deleteWish');

router.post('/newWish', auth, createWish.createWish);
router.put('/updateWish', auth, updateWish.updateWish);
router.delete('/deleteWish', auth, deleteWish.deleteWish);

module.exports = router;