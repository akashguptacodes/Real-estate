const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try{
        const token = req.cookies?.tokenCookie || req.body.token || req.header("Authorization").replace("Bearer", "")
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Token missing'
            })
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();

        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: 'Invalid token'
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while validating token'
        })
    }
}

exports.IsAdmin = async (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for admin'
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while validating admin'
        })
    }
}