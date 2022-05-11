const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const {authMiddleware} = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', authMiddleware, commentCtrl.getAllComments);
router.get('/all/:id', authMiddleware, commentCtrl.getAllCommentsPost);
router.get('/:id', authMiddleware, commentCtrl.getOneComment);
router.post('/', authMiddleware, multer, commentCtrl.createComment);
router.delete('/:id', authMiddleware, commentCtrl.deleteComment);
router.put('/:id', authMiddleware, multer, commentCtrl.modifyComment);
router.post('/:id/like', authMiddleware, commentCtrl.likeComment);


module.exports = router;