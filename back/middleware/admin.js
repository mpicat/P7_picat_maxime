require('dotenv').config();
const User = require('../models/User');
const { verifyUserToken, getTokenFromReqHeaders } = require('./auth');

const adminMiddleware = (req, res, next) => {
    try {
        const userId = verifyUserToken(getTokenFromReqHeaders(req));
        User.findOne({where: {admin: "Yes"}})
        .then(user => {
            if (user.userId === userId) {
                console.log("Admin identifié !")
                req.isAdmin = process.env.ADMIN_TOKEN;
                next();
            } else {
                console.log("Admin non identifié !")
                next();
            }
        })
        .catch((err) => res.status(404).json({error : 'Aucun admin dans la base de données'}))
        
    } catch (error) {
        res.status(403).json({error: 'Action non autorisée'});
    }
};



module.exports = {
    adminMiddleware
};

