require('dotenv').config();
const Post = require('../models/Post');
const LikePost = require('../models/LikePost');
const fs = require('fs');
const serverErrorMess =  "Erreur, veuillez réessayer plus tard...";

// récupération de tous les posts
exports.getAllPosts = (req, res, next) => {
    Post.findAll()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({message: "Posts non trouvés !"}));
};

// récupération d'un post
exports.getOnePost = (req, res, next) => {
    Post.findOne({where : {postId: req.params.id}})
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({message: "Post non trouvé !"}));
};

// création d'un post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    const post = Post.create({
        ...postObject,
        media: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    .then(() => res.status(201).json({message: "Post créé !"}))
    .catch(error => res.status(400).json({message: "Post non créé"}));
};

// suppression d'un post
exports.deletePost = (req, res, next) => {
    Post.findOne({where: {postId: req.params.id}})
    .then((post) => {
        if (!post) {
            res.status(404).json({error : 'Post non trouvé !'});
        } else if (post.userId !== req.auth.userId && !isAdmin(req)) {
            res.status(403).json({error : 'Requête non autorisée !'});
        } else {
            const filename = post.media.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Post.destroy({where: {postId: req.params.id}})
                .then(() => res.status(200).json({ message: 'Post supprimé !'}))
                .catch(error => res.status(400).json({ message: 'Post non supprimé !'}));
            });
        }
    })
    .catch(error => res.status(500).json({serverErrorMess}));
};

// mise à jour post
exports.modifyPost = (req, res, next) => {
    if (req.error) {
        res.status(403).json({error: "Non autorisé"});
    } 
    else {
        const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            media: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
        Post.update({...postObject, postId: req.params.id}, {where: {postId: req.params.id}})
        .then(() => res.status(200).json({ message: 'Post modifié !'}))
        .catch(error => res.status(400).json({ message: 'Post non modifié !'}));
    }
};

// like et dislike post
exports.likePost = async (req, res, next) => {
    let choice = req.body.like
    const likedPost = await LikePost.findOne({where: {postId: req.params.id, userId: req.body.userId, likeType: "like"}});
    const dislikedPost = await LikePost.findOne({where: {postId: req.params.id, userId: req.body.userId, likeType: "dislike"}});
    const noOpinionPost = await LikePost.findOne({where: {postId: req.params.id, userId: req.body.userId, likeType: ""}});

    switch (choice) {
        case "like" :
            if (likedPost) {
                res.status(400).json({message: "Vous avez déjà liké ce post"});
            }
            else if (dislikedPost) {
                res.status(400).json({message: "Vous devez retirer votre dislike pour liker ce post"});
            }
            else if (noOpinionPost){
                LikePost.update({likeType: "like"}, {where: {postId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous avez liké" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
            }
            else { 
                LikePost.create({
                    postId: req.params.id,
                    userId: req.body.userId,
                    likeType: "like"
                })
                .then(() => res.status(200).json({message: "Vous avez liké"}))
                .catch((error) => res.status(400).json({message: "Une erreur est intervenue lorsque vous avez voulu liker"}))
            } 
            break;
        
        case "" :
            if (likedPost) {
                LikePost.update({likeType: ""}, {where: {postId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous ne likez plus" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue lorsque vous avez voulu retirer votre vote" }))
            }
            else if (dislikedPost) { 
                LikePost.update({likeType: ""}, {where: {postId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous ne dislikez plus" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue lorsque vous avez voulu retirer votre vote" }))
            }
            else { 
                res.status(400).json({message: "Vous n'avez pas voté pour ce post"});
            }
            break;
        
        case "dislike" :
            if (dislikedPost) {
                res.status(400).json({message: "Vous avez déjà disliké ce post"});
            }
            else if (likedPost) {
                res.status(400).json({message: "Vous devez retirer votre like pour liker ce post"});
            }
            else if (noOpinionPost){
                LikePost.update({likeType: "dislike"}, {where: {postId: req.params.id, userId: req.body.userId}})
                    .then(() => res.status(200).json({ message: "Vous avez disliké" }))
                    .catch((error) => res.status(400).json({ message: "Une erreur est intervenue" }))
            }
            else { 
                LikePost.create({
                    postId: req.params.id,
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