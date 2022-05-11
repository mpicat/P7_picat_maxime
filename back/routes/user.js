const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkPassword = require('../middleware/check-password');
const {authMiddleware} = require('../middleware/auth');

router.post('/signup', checkPassword, userCtrl.signup);
router.get('/verify/:confirmationToken', userCtrl.verify);
router.post('/login', userCtrl.login);
router.get('/:id', authMiddleware, userCtrl.getOneUser);
router.delete('/delete/:id', authMiddleware, userCtrl.deleteUser);
router.put('/modify', authMiddleware, userCtrl.modifyUser);
router.get('/logout/:id', authMiddleware, userCtrl.logout);


module.exports = router;