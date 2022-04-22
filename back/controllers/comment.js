const Comment = require('../models/Comment');
const LikeComment = require('../models/LikeComment');
const fs = require('fs');
const serverErrorMess =  "Erreur, veuillez réessayer plus tard...";

// récupération de tous les comments
exports.getAllComments = (req, res, next) => {
    Comment.findAll()
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(400).json({message: "Comments non trouvés !"}));
};

// récupération d'un comment
exports.getOneComment = (req, res, next) => {
    Comment.findOne({where : {commentId: req.params.id}})
    .then(comment => res.status(200).json(comment))
    .catch(error => res.status(404).json({message: "Comment non trouvé !"}));
};

// création d'un comment
exports.createComment = (req, res, next) => {
    const commentObject = JSON.parse(req.body.comment);
    const comment = Comment.create({
        ...commentObject,
        media: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    .then(() => res.status(201).json({message: "Comment créé !"}))
    .catch(error => res.status(400).json({error}));
};

// suppression d'un comment
exports.deleteComment = (req, res, next) => {
    Comment.findOne({where: {commentId: req.params.id}})
    .then((comment) => {
        if(!comment) {
            return res.status(404).json({error : 'Comment non trouvé !'});
        }
        if(comment.userId !== req.auth.userId) {
            return res.status(403).json({error : 'Requête non autorisée !'});
        }
        const filename = comment.media.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Comment.destroy({where: {commentId: req.params.id}})
            .then(() => res.status(200).json({ message: 'Comment supprimé !'}))
            .catch(error => res.status(400).json({message: 'Comment non supprimé !'}));
        });
    })
    .catch(error => res.status(500).json({serverErrorMess}));
};

// mise à jour d'un comment
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

// like et dislike comment
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
                    .then(() => res.status(200).json({ message: "Vous avez liké" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
            }
            else { 
                LikeComment.create({
                    commentId: req.params.id,
                    userId: req.body.userId,
                    likeType: "like"
                })
                .then(() => res.status(200).json({message: "Vous avez liké"}))
                .catch((error) => res.status(400).json({message: "Une erreur est intervenue lorsque vous avez voulu liker"}))
            } 
            break;
        
        case "" :
            if (likedComment) {
                LikeComment.update({likeType: ""}, {where: {commentId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous ne likez plus" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue lorsque vous avez voulu retirer votre vote" }))
            }
            else if (dislikedComment) { 
                LikeComment.update({likeType: ""}, {where: {commentId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous ne dislikez plus" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue lorsque vous avez voulu retirer votre vote" }))
            }
            else { 
                res.status(400).json({message: "Vous n'avez pas voté pour ce comment"});
            }
            break;
        
        case "dislike" :
            if (dislikedComment) {
                res.status(400).json({message: "Vous avez déjà disliké ce comment"});
            }
            else if (likedComment) {
                res.status(400).json({message: "Vous devez retirer votre like pour liker ce comment"});
            }
            else if (noOpinionComment){
                LikeComment.update({likeType: "dislike"}, {where: {commentId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous avez disliké" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
            }
            else { 
                LikeComment.create({
                    commentId: req.params.id,
                    userId: req.body.userId,
                    likeType: "dislike"
                })
                .then(() => res.status(200).json({message: "Vous avez disliké"}))
                .catch((error) => res.status(400).json({message: "Une erreur est intervenue lorsque vous avez voulu disliker"}))
            }
            break;

        default: console.log("Une erreur est intervenue");
    }
};