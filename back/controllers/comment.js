require('dotenv').config();
const Comment = require('../models/Comment');
const LikeComment = require('../models/LikeComment');
const fs = require('fs');
const sequelize = require('../utils/database');
const serverErrorMess =  "Erreur, veuillez réessayer plus tard...";


// GET ALL COMMENTS
exports.getAllComments = (req, res, next) => {
    Comment.findAll({
        include: {
            model: LikeComment,
            attributes: ['likeType', 'userId']
        }
    })
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(400).json({message: "Comments non trouvés !"}));
};


// GET ALL COMMENTS FROM ONE POST
exports.getAllCommentsPost = (req, res, next) => {
    Comment.findAll({
        include: {
            model: LikeComment,
            attributes: ['likeType', 'userId']
        },
        where : {postId: req.params.id}
    })
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(400).json({message: "Comments de ce post non trouvés !"}));
};


// GET ONE COMMENT
exports.getOneComment = (req, res, next) => {
    Comment.findOne({where : {commentId: req.params.id}})
    .then(comment => res.status(200).json(comment))
    .catch(error => res.status(404).json({message: "Comment non trouvé !"}));
};


// CREATE ONE COMMENT
exports.createComment = async (req, res, next) => {
    const commentObject = req.file ?
        {
            ...JSON.parse(req.body.comment),
            media: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    
    try {
        const comment = await Comment.create({
            ...commentObject,
            likes: 0,
            dislikes: 0
        });
        // create a data who can be use by the front without doing more request
        res.status(201).json({
            message: "Comment créé !",
            data: {...comment.toJSON(), likecomments: []}
        })
    } catch (error) {
        res.status(500).json({serverErrorMess})
    }
};


// DELETE ONE COMMENT
exports.deleteComment = (req, res, next) => {
    Comment.findOne({where: {commentId: req.params.id}})
    .then((comment) => {
        if(!comment) {
            res.status(404).json({error : 'Comment non trouvé !'});
        } else if(comment.userId !== req.auth.userId && !isAdmin(req)) {
            res.status(403).json({error : 'Requête non autorisée !'});
        } else if (comment.media) {
        const filename = comment.media.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Comment.destroy({where: {commentId: req.params.id}})
            .then(() => res.status(200).json({ message: 'Comment et image supprimés !'}))
            .catch(error => res.status(400).json({ message: 'Comment et image non supprimés !'}));
        });
        } else {
            Comment.destroy({where: {commentId: req.params.id}})
            .then(() => res.status(200).json({ message: 'Comment supprimé !'}))
            .catch(error => res.status(400).json({ message: 'Comment non supprimé !'}));
        }
    })
    .catch(error => res.status(500).json({serverErrorMess}));
};


// UPDATE ONE COMMENT
exports.modifyComment = (req, res, next) => {
    if (req.error) {
        res.status(403).json({error: "Non autorisé"});
    } else {
        const commentObject = req.file ?
        {
            ...JSON.parse(req.body.comment),
            media: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
        Comment.update({...commentObject, commentId: req.params.id}, {where: {commentId: req.params.id}})
        .then(() => res.status(200).json({ message: 'Comment modifié !'}))
        .catch(error => res.status(400).json({ message: 'Comment non modifié !'}));
    }
};


// OPINION ABOUT A COMMENT
exports.likeComment = async (req, res, next) => {
    let choice = req.body.like
    const likedComment = await LikeComment.findOne({where: {commentId: req.params.id, userId: req.body.userId, likeType: "like"}});
    const dislikedComment = await LikeComment.findOne({where: {commentId: req.params.id, userId: req.body.userId, likeType: "dislike"}});
    const noOpinionComment = await LikeComment.findOne({where: {commentId: req.params.id, userId: req.body.userId, likeType: ""}});

    switch (choice) {
        case "like" :
            if (likedComment) {
                res.status(400).json({message: "Vous avez déjà liké ce comment"});
            }
            else if (dislikedComment) {
                res.status(400).json({message: "Vous devez retirer votre dislike pour liker ce comment"});
            }
            else if (noOpinionComment){
                LikeComment.update({likeType: "like"}, {where: {commentId: req.params.id, userId: req.body.userId}})
                    .then(() => 
                        // augmente les likes de 1 sur le model Post
                        Comment.update(
                            {likes: sequelize.literal('likes + 1')},
                            {where: {commentId: req.params.id}})
                        .then(() => res.status(200).json({ message: "Vous avez liké" }))
                        .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
                    )
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
            }
            else { 
                LikeComment.create({
                    commentId: req.params.id,
                    userId: req.body.userId,
                    likeType: "like"
                })
                .then(() => 
                    // augmente les likes de 1 sur le model Comment
                    Comment.update(
                        {likes: sequelize.literal('likes + 1')},
                        {where: {commentId: req.params.id}})
                    .then(() => res.status(200).json({ message: "Vous avez liké" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
                )
                .catch((error) => res.status(400).json({message: "Une erreur est intervenue lorsque vous avez voulu liker"}))
            } 
            break;
        
        case "" :
            if (likedComment) {
                LikeComment.update({likeType: ""}, {where: {commentId: req.params.id, userId: req.body.userId}})
                .then(() => 
                    // diminue les likes de 1 sur le model Comment
                    Comment.update(
                        {likes: sequelize.literal('likes - 1')},
                        {where: {commentId: req.params.id}})
                    .then(() => res.status(200).json({ message: "Vous ne likez plus ce Comment" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
                )
                .catch((error) => res.status(400).json({ message: "Une erreur est intervenue lorsque vous avez voulu retirer votre vote" }))
            }
            else if (dislikedComment) { 
                LikeComment.update({likeType: ""}, {where: {commentId: req.params.id, userId: req.body.userId}})
                .then(() => 
                    // diminue les dislikes de 1 sur le model Comment
                    Comment.update(
                        {dislikes: sequelize.literal('dislikes - 1')},
                        {where: {commentId: req.params.id}})
                    .then(() => res.status(200).json({ message: "Vous ne dislikez plus ce Comment" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
                )
                .catch((error) => res.status(400).json({ message: "Une erreur est intervenue lorsque vous avez voulu retirer votre vote" }))
            }
            else { 
                res.status(400).json({message: "Vous n'avez pas voté pour ce Comment"});
            }
            break;
        
        case "dislike" :
            if (dislikedComment) {
                res.status(400).json({message: "Vous avez déjà disliké ce Comment"});
            }
            else if (likedComment) {
                res.status(400).json({message: "Vous devez retirer votre like pour liker ce Comment"});
            }
            else if (noOpinionComment){
                LikeComment.update({likeType: "dislike"}, {where: {commentId: req.params.id, userId: req.body.userId}})
                .then(() => 
                    // augmente les dislikes de 1 sur le model Comment
                    Comment.update(
                        {dislikes: sequelize.literal('dislikes + 1')},
                        {where: {commentId: req.params.id}})
                    .then(() => res.status(200).json({ message: "Vous avez disliké" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
                )
                .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
            }
            else { 
                LikeComment.create({
                    commentId: req.params.id,
                    userId: req.body.userId,
                    likeType: "dislike"
                })
                .then(() => 
                        // augmente les dislikes de 1 sur le model Comment
                        Comment.update(
                            {dislikes: sequelize.literal('dislikes + 1')},
                            {where: {commentId: req.params.id}})
                        .then(() => res.status(200).json({ message: "Vous avez disliké" }))
                        .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
                    )
                .catch((error) => res.status(400).json({message: "Une erreur est intervenue lorsque vous avez voulu disliker"}))
            } 
            break;

        default: console.log("Une erreur est intervenue");
    }
};