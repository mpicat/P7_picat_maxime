require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sgMail = require('@sendgrid/mail');
const API_KEY = process.env.API_KEY_NAME;
const randomstring = require('randomstring');
const serverErrorMess = 'Erreur, veuillez réessayer plus tard...';


// REGISTER NEW USER
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(async hash => {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            status: 'Pending',
            confirmationToken: randomstring.generate(),
            admin: 'NO'
        });
        sgMail.setApiKey(API_KEY)
        const message = {
            to: req.body.email,
            from: {
                name:'Groupomania',
                email: 'maxime.picat@coursdiderot.com'
            },
            subject: 'Email de confirmation',
            text: 'Bonjour et bienvenue sur Groupomania ! Pour activer votre email, veuillez activer le mode html de votre boîte de réception !',
            html: `<h1>Bonjour et bienvenue sur Groupomania !</h1><br><p>Veuillez confirmer votre email en cliquant sur le lien suivant : <a href="http://localhost:3000/api/auth/verify/${user.confirmationToken}">Cliquez ici</a> !</p>`,
        };
        sgMail.send(message)
        .then(res => console.log('Mail envoyé'))
        .catch(err => console.log("Problème dans l'envoi de mail"))
        
        .then(() => res.status(201).json({message : "Utilisateur créé !"}))
        .catch(error => res.status(400).json({message : "L'utilisateur n'a pas été créé"}));
    })
    .catch(error => res.status(500).json({serverErrorMess}))
};


// MAIL CHECK CREATION USER
exports.verify = (req, res, next) => {
    User.findOne({where: {confirmationToken: req.params.confirmationToken}})
        .then(user => {
            if (!user) {
                return res.status(404).json({error: "Utilisateur non trouvé !"})
            }
            if (user.email === process.env.SUPER_ADMIN_EMAIL) {
                // confirm mail + add admin role
                User.update({status:"Active", admin: "YES"}, {where: {confirmationToken: req.params.confirmationToken}})
                return res.status(200).json({ message: "Email d'Admin confirmé !"})
            }
            // confirm mail
            User.update({status: "Active"}, {where: {confirmationToken: req.params.confirmationToken}})
            .then(() => res.status(200).json({ message: "Email d'utilisateur confirmé !"}))
            .catch(error => res.status(400).json({ message: "Email d'utilisateur non confirmé !"}));
        })
        .catch((err) => res.status(500).json({serverErrorMess}))
};


// CONNEXION USER
exports.login = async (req, res, next) => {
    await User.findOne({where: {email: req.body.email}})
    .then(user => {
        if(!user) {
            return res.status(404).json({error: 'Utilisateur non trouvé !'});
        }
        if(user.status != "Active") {
            return res.status(400).json({error: "Vous n'avez pas vérifié votre email de confirmation !"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                res.status(401).json({message: 'Mot de passe incorrect !'});
            }
            else {
                res.status(200).json({
                    userId: user.userId,
                    name: user.name,
                    token: jwt.sign (
                        {userId: user.userId},
                        process.env.SECRET_TOKEN,
                        {expiresIn: '24h'}
                        )
                });
            }
        })
        .catch(error => res.status(500).json({serverErrorMess}));
    })
    .catch(error => res.status(500).json({serverErrorMess}))
};


// DELETE USER
exports.deleteUser = (req, res, next) => {
    User.findOne({where: {userId: req.params.id}})
    .then((user) => {
        if(!user) {
            return res.status(404).json({error : 'Utilisateur non trouvé !'});
        }
        if(user.userId !== req.auth.userId) {
            return res.status(403).json({error : 'Requête non autorisée !'});
        }
        User.destroy({where: {userId: req.params.id}})
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
        .catch(error => res.status(400).json({message: 'Utilisateur non supprimé !'}));
    })
    .catch(error => res.status(500).json({serverErrorMess}));
};


// UPDATE USER
exports.modifyUser = (req, res, next) => {
    User.findOne({where: {userId: req.body.userId}})
    .then((user) => {
        if(!user) {
            return res.status(404).json({error : 'Utilisateur non trouvé !'});
        }
        if(user.userId !== req.auth.userId) {
            return res.status(403).json({error : 'Requête non autorisée !'});
        }
        User.update({name: req.body.name, email: req.body.email}, {where: {userId: req.body.userId}})
        .then(() => res.status(200).json({ message: 'Utilisateur mis à jour !'}))
        .catch(error => res.status(400).json({message: 'Utilisateur non mis à jour !'}));
    })
    .catch(error => res.status(500).json({serverErrorMess}));
};


// LOGOUT USER
exports.logout = (req, res, next) => {
    User.findOne({where: {userId: req.params.id}})
    .then((user) => {
        if(!user) {
            res.status(404).json({error : 'Utilisateur non trouvé !'});
        }
        else if(user.userId !== req.auth.userId) {
            res.status(403).json({error : 'Requête non autorisée !'});
        } else {
            res.status(200).json({message : 'Déconnecté !'});
        }
    })
    .catch(error => res.status(500).json({serverErrorMess}));
};


// GET ONE USER
exports.getOneUser = (req, res, next) => {
    User.findOne({where : {userId: req.params.id}})
    .then(user => res.status(200).json({
        user: user.userId,
        name: user.name,
        email: user.email
    }))
    .catch(error => res.status(404).json({message: "User non trouvé !"}));
};
