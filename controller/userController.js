import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/error.js'
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import {generateToken} from '../config/jwtToken.js'
const registerUser = asyncHandler( async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email:email});
    if(!user){
        // create a new user
        const newUser = await User.create(req.body);
        return res.json( {message:SUCCESS, user: newUser})
    }else{
        const error = appError.create("user already exists.",400, FAIL)
        return next(error);
        }
    }
);
const login = asyncHandler(async(req,res,next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        //not Exist
        const error = appError.create("Email or password is wrong.", 400 , FAIL);
       return next(error)
    }else{
        // user Exists 
        const matchingPassword = await user.isMatchPassword(password);
        if(matchingPassword){
           return res.status(200).json({status:SUCCESS, message:"Loggin success.", user:{
            _id: user?._id,
            firstName:user?.firstName,
            lastName:user?.lastName,
            email:user?.email,
            mobile:user?.mobile,
            token: await generateToken(user?._id)
           }})
        }else{
            const error = appError.create("Email or password is wrong.", 400 , FAIL);
           return next(error)
        }
    }  
})

const getAllUsers = asyncHandler( async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const users = await User.find({}, {__v : false}).limit(limit).skip(((page - 1) * limit));
    //console.log(users);
    res.json({status:SUCCESS, data : {users}});
}
)
export {
    registerUser,
    login,
    getAllUsers
}