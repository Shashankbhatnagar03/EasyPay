const {JWT_SECRET}  = require('./config');
const jwt = require('jsonwebtoken');

const authMiddleware  = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer'))
    {
        res.status(403).json({
            message : "missing auth"
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.decode(token , JWT_SECRET);

        req.userId = decoded.userId;

        next();
    }
    catch(err){
        return res.status(403).json({
            message : "Something went wrong"
        });
    }

};

module.exports={
    authMiddleware
}