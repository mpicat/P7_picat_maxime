const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkPassword = require('../middleware/check-password');
const {authMiddleware} = require('../middleware/auth');
// rajout route admin sur delete et put

router.post('/signup', checkPassword, userCtrl.signup);
router.get('/verify/:confirmationToken', userCtrl.verify);
router.post('/login', userCtrl.login);
router.delete('/delete/:id', authMiddleware, userCtrl.deleteUser);
router.put('/modify', authMiddleware, userCtrl.modifyUser);
router.get('/logout/:id', authMiddleware, userCtrl.logout);
router.get('/:id', authMiddleware, userCtrl.getOneUser);


module.exports = router;