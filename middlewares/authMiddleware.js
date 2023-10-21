import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import appError from '../utils/error.js'
import { ERROR, FAIL } from '../utils/errorText.js';
const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    if(token){
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id } = decodedToken;
        const user = await User.findById(id);
        req.user = user;
        next();
    }else{
        throw appError.create("Expired or Invalid token", 401 , FAIL)
    }
    }else{
    throw appError.create("There is no token",401,FAIL);
    }
})

const isAdmin = asyncHandler(async(req, res, next)=>{
    const { email } = req.user;
    const adminUser = await User.findOne({email:email});
    if(adminUser.role !== "admin"){
        throw appError.create("Unauthorized, Only admin is allowed.",401,ERROR);
    }else{
        next();
    }
})


export {authMiddleware, isAdmin}