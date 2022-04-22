require('dotenv').config();
const User = require('../models/User');
const { verifyUserToken, getTokenFromReqHeaders } = require('./auth');

const adminMiddleware = (req, res, next) => {
    // TODO check if user id from req is admin (with a SQL query)
    // TODO if so pass the information to the request for the next middleware
    try {
        const userId = verifyUserToken(getTokenFromReqHeaders(req));
        User.findOne({where: {admin: "Yes"}})
        .then(user => {
            // THIS PATH CRASH THE APP and the admin can modificate a post
            if (user.userId === userId) {
                console.log("Admin identifié !")
                req.isAdmin = process.env.ADMIN_TOKEN;
                next();
            } else {
                // THIS PATH LOOKS OK
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

