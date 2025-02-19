const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



exports.register = async (req, res) => {
    const { firstName, lastName, userName, email, password, confirmPassword, contactNo } = req.body;

    //validate
    if(!firstName || !lastName ||!userName ||!email ||!password ||!contactNo ||!confirmPassword){
        return res.status(401).json({
            success: false,
            message:'All fields are required',
        })
    }

    if(password !== confirmPassword){
        return res.status(401).json({
            success: false,
            message: 'Passwords do not match',
        })
    }
    try{

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: 'User already exists',
            })
        }
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            contactNo,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        
    
        return res.status(200).json({
            success: true,
            message: 'User created successfully',
        })
    }
    catch(error){
        console.log('Failed to create user', error);
        
        return res.status(500).json({
            success: false,
            message: `Internal server error`,
        })
    }


}


exports.login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(401).json({
            success: false,
            message:'All fields are required',
        })
    }

    const user = await User.findOne({email:email});

    if(!user){
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        })
    }

    if(await bcrypt.compare(password, user.password)){
        const payload = {
            email: user.email,
            id: user._id
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:'3h'
        })

        user.token = token;
        user.password = undefined;

        const options = {
            expiresIn: new Date(Date.now() + 2*24*60*60*1000),
            httpOnly: true,
        }
        res.cookie('tokenCookie', token, options).json({
            success: true,
            token,
            user,
            message: 'logged in successfully'
        })
    }
    else{
        return res.status(401).json({
            success: false,
            message: 'Login failure, Invalid email or password',
        })
    }
}

exports.logout = (req, res) => {
    res.clearCookie('tokenCookie').status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
}