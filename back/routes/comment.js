const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const {authMiddleware} = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const { adminMiddleware } = require('../middleware/admin');

router.get('/', authMiddleware, commentCtrl.getAllComments);
router.get('/all/:id', authMiddleware, commentCtrl.getAllCommentsPost);
router.get('/:id', authMiddleware, commentCtrl.getOneComment);
router.post('/', authMiddleware, multer, commentCtrl.createComment);
router.delete('/:id', adminMiddleware, authMiddleware, commentCtrl.deleteComment);
router.put('/:id', adminMiddleware, authMiddleware, multer, commentCtrl.modifyComment);
router.put('/allcomments/:id', adminMiddleware, authMiddleware, multer, commentCtrl.modifyCommentsUser);
router.put('/likecomments/:id', adminMiddleware, authMiddleware, multer, commentCtrl.modifyLikeCommentsUser);
router.post('/:id/like', authMiddleware, commentCtrl.likeComment);


module.exports = router;