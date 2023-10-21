import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/error.js'
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import {generateToken} from '../config/jwtToken.js'
import { validateMongoId } from '../utils/validateMongoDBId.js';


const registerUser = asyncHandler( async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email:email});
    if(!user){
        // create a new user
        const newUser = await User.create(req.body);
        return res.json( {message:SUCCESS, user: newUser})
    }else{
        throw appError.create("user already exists.",400, FAIL)
        }
    }
);
const login = asyncHandler(async(req,res,next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        //not Exist
        throw appError.create("Email or password is wrong.", 400 , FAIL);
      
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
            throw appError.create("Email or password is wrong.", 400 , FAIL);
        }
    }  
})

const getAllUsers = asyncHandler( async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const users = await User
    .find({}, {__v : false})
    .limit(limit)
    .skip(((page - 1) * limit));

    res.json({status:SUCCESS, data : {users}});
}
)

const getSingleUser  = asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    validateMongoId(id)
    const user = await User.findById(id);
    if(!user){
        throw appError.create("Invalid user id.",404,ERROR);
    }else{
       return res.status(200).json({status:SUCCESS,data:user})
    }
})

const deleteSingleUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const user = await User.findById(id);
    if(!user){
        throw appError.create("Invalid user id.",404,ERROR);
    }else{
        await User.findByIdAndDelete(id);
        res.status(200).json({status:SUCCESS,data:null});
    }
})

const deleteMyAccount = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    validateMongoId(_id);
    const user = await User.findById(_id);
    if(!user){
        throw appError.create("Invalid user id.",404,ERROR);
    }else{
        await User.findByIdAndDelete(_id);
        res.status(200).json({status:SUCCESS,data:null});
    }
})

const updateSingleUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoId(_id)  
    const user = await User.findById(_id);
    if(!user){
        throw appError.create("Invalid user id.",404,ERROR);
    }else{
        const updatedUser = await User.findByIdAndUpdate(_id,{...req.body},{new:true});
        res.status(200).json({status:SUCCESS,data:updatedUser});
    }
})

const blockUser = asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    validateMongoId(id);
    const userToBlock = await User.findByIdAndUpdate(id, {isBlocked:true},{new:true});
    if(!userToBlock){
        throw appError.create("Invalid user id.",404,FAIL)
    }else{
        res.status(200).json({status:SUCCESS,message:"User blocked"})
    }
})
const unBlockUser = asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    validateMongoId(id);
    const userToUnBlock = await User.findByIdAndUpdate(id, {isBlocked:false},{new:true});
    if(!userToUnBlock){
        throw appError.create("Invalid user id.",404,FAIL)
    }else{
        res.status(200).json({status:SUCCESS,message:"User unblocked"})
    }
})


export {
    registerUser,
    login,
    getAllUsers,
    getSingleUser,
    deleteSingleUser,
    updateSingleUser,
    blockUser,
    unBlockUser,
    deleteMyAccount
}