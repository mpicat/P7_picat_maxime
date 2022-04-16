const multer = require('multer');
const { verifyUserToken, getTokenFromReqHeaders } = require('./auth');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let outcome = false;
        try {
            let prop = null;
            if (req.body.post) {
                prop = "post";
            } 
            if (req.body.comment) {
                prop = "comment";
            } 
            if (req.body.like) {
                prop = "like";
            }
            verifyUserToken(getTokenFromReqHeaders(req), JSON.parse(req.body[prop]).userId);
            outcome = true;
        } catch (err) {
            console.error(err);
            req.error = true;
        }
        cb(null, outcome);
    } 
}).single('image');