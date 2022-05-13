const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const {authMiddleware} = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const { adminMiddleware } = require('../middleware/admin');

router.get('/', authMiddleware, postCtrl.getAllPosts);
router.get('/:id', authMiddleware, postCtrl.getOnePost);
router.post('/', authMiddleware, multer, postCtrl.createPost);
router.delete('/:id', adminMiddleware, authMiddleware, postCtrl.deletePost);
router.put('/:id', adminMiddleware, authMiddleware, multer, postCtrl.modifyPost);
router.put('/all/:id', adminMiddleware, authMiddleware, multer, postCtrl.modifyPostsUser);
router.put('/likeposts/:id', adminMiddleware, authMiddleware, multer, postCtrl.modifyLikePostsUser);
router.post('/:id/like', authMiddleware, postCtrl.likePost);


module.exports = router;