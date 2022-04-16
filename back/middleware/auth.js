const jwt = require('jsonwebtoken');
require('dotenv').config();

const getTokenFromReqHeaders = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    return token;
}

const getUserIdFromReqBody = (req) => {
    const reqUserId = req.body && req.body.userId ? req.body.userId : '';
    return reqUserId;
}

const verifyUserToken = (token, reqUserId) => {
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    if (reqUserId && reqUserId !== userId) {
        throw 'User ID non valable !';
    }
    return userId;
}

const authMiddleware = (req, res, next) => {
    try {
        const userId = verifyUserToken(getTokenFromReqHeaders(req), getUserIdFromReqBody(req));
        req.auth = {userId};
        next();
        // rajout contrôle admin
        if (req.isAdmin && req.isAdmin === process.env.ADMIN_TOKEN) {
            next()
        }
    } catch (error) {
        res.status(403).json({error: 'Action non autorisée'});
    }
};

module.exports = {
    getTokenFromReqHeaders,
    getUserIdFromReqBody,
    verifyUserToken,
    authMiddleware
};