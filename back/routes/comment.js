const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const {authMiddleware} = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// rajout route admin sur delete et put

router.get('/', authMiddleware, commentCtrl.getAllComments);
router.get('/:id', authMiddleware, commentCtrl.getOneComment);
router.post('/', authMiddleware, multer, commentCtrl.createComment);
router.delete('/:id', authMiddleware, commentCtrl.deleteComment);
router.put('/:id', authMiddleware, multer, commentCtrl.modifyComment);
router.post('/:id/like', authMiddleware, commentCtrl.likeComment);


module.exports = router;