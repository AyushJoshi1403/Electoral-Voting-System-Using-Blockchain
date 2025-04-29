const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err){
            return res.status(500).json(err);
        }else{
            req.user = payload;
            next();
        }
    })
}

module.exports = verifyToken;