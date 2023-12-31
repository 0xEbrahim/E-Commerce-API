import User from '../models/userModel.js';
import Product from "../models/productModel.js"
import Cart from "../models/cartModel.js"
import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/error.js'
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import {generateToken} from '../config/jwtToken.js'
import { validateMongoId } from '../utils/validateMongoDBId.js';
import { generateRefreshToken } from '../config/refreshToken.js';
import { sendEmail } from './emailController.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import uniqid from 'uniqid'
import { stat } from 'fs';

const registerUser = asyncHandler( async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email:email});
    if(!user){
        // create a new user
        const newUser = await User.create(req.body);
        return res.json( {message:SUCCESS, data: newUser})
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
            const refreshToken = await generateRefreshToken(user?._id);
            await User.findByIdAndUpdate(user?._id, {
                refreshToken:refreshToken
            },{
                new:true
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            });

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

// admin login
const adminLogin = asyncHandler(async(req,res,next) => {
    const {email, password} = req.body;
    const admin = await User.findOne({email:email});
    if(admin.role !== "admin"){
        throw appError.create("You are not an admin", 401 , ERROR)
    }
    if(!admin){
        //not Exist
        throw appError.create("Email or password is wrong.", 400 , FAIL);
    }else{
        // user Exists 
        const matchingPassword = await admin.isMatchPassword(password);
        if(matchingPassword){
            const refreshToken = await generateRefreshToken(admin?._id);
            await User.findByIdAndUpdate(admin?._id, {
                refreshToken:refreshToken
            },{
                new:true
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000
            });

            return res.status(200).json({status:SUCCESS, message:"Loggin success.", user:{
            _id: admin?._id,
            firstName:admin?.firstName,
            lastName:admin?.lastName,
            email:admin?.email,
            mobile:admin?.mobile,
            token: await generateToken(admin?._id)
           }})
        }else{
            throw appError.create("Email or password is wrong.", 400 , FAIL);
        }
    }  
})



// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res, next)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw appError.create("No refresh token in cookies", 400, ERROR);
    }
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user) throw appError.create("Invalid refresh token.",401, FAIL);
    jwt.verify(user?.refreshToken, process.env.JWT_SECRET_KEY, asyncHandler(async (err, decoded)=> {
        if(err || user.id != decoded?.id){
            throw appError.create("There is something wrong with refresh token", 401, ERROR);
        }
       const accessToken = await generateToken(user?._id);
       res.status(200).json({status: SUCCESS, data:{accessToken}})
    }));
})

// log-out

const logOut = asyncHandler(async (req, res, next) => {
    const cookie = req.cookies;
     if(!cookie?.refreshToken){
            throw appError.create("No refresh token in cookies", 400, ERROR);
    }
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({refreshToken: refreshToken});
    if(!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure:true,
        })
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: ""
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure:true,
    })
    return res.sendStatus(204);
})

// user address

const saveAddress = asyncHandler(async(req, res, next) => {
    const {_id} = req.user;
    validateMongoId(_id);
    const updatedUser = await User.findByIdAndUpdate(_id,{
        address: req?.body?.address
    },{
        new : true
    })
    res.status(200).json({status: SUCCESS, data: updatedUser})
})

const getAllUsers = asyncHandler( async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const users = await User
    .find({}, {__v : false})
    .limit(limit)
    .skip(((page - 1) * limit)).populate('wishlist');

    res.json({status:SUCCESS, data : {users}});
}
)

const getSingleUser  = asyncHandler(async(req, res, next)=>{
    const {id} = req.params;
    validateMongoId(id)
    const user = await User.findById(id).populate('wishlist');
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

const changePassword = asyncHandler(async(req, res, next) => {
    const {_id} = req.user;
    validateMongoId(_id);
    const {password} = req.body;
    const user = await User.findById(_id);
    if(password){
        const matchingPassword = await user.isMatchPassword(password);
        if(matchingPassword){
            throw appError.create("New password can't be the same as old one.",400,FAIL);
        }
        user.password = password;
        const updatedUserWithPassword = await user.save();
        res.status(201).json({status: SUCCESS, data: updatedUserWithPassword});
    }else{
        throw appError.create("Password can't be empty", 400, ERROR);
    } 
}
)

const forgotPasswordToken = asyncHandler(async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        throw appError.create("User not found", 404, ERROR);
    }else{
        const token = await user.createPasswordResetToken();
        //console.log(token)
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. this link is valid till 30 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
        const data = {
            to: email,
            text:"Hey User",
            subject: "Forgot Password link",
            htm: resetURL,
        }
        sendEmail(data);
        res.status(200).json({status: SUCCESS, token: token})
    }
    
})

const resetPassword = asyncHandler(async(req, res, next) => {
    const {password} = req.body;
    const { token } = req.params;
    const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
       passwordResetExpires: { $gt: Date.now() },
      });
    if(!user){
        throw appError.create("Invalid token", 401, ERROR);
    }else{
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.status(200).json({status: SUCCESS , data: user})
    }
})

const getWishlist = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    validateMongoId(_id)
    const wishlist = await User.findById(_id,{wishlist:true}).populate("wishlist");
    if(!wishlist){
        throw appError.create("Resource not found.", 404 , ERROR)
    }else{
        res.status(200).json({status: SUCCESS, data : wishlist})
    }
})

const userCart = asyncHandler(async(req, res, next) => {
    let products = [];
    const {cart} = req.body;
    const {_id} = req.user;
    //console.log("id -> ", _id);
    validateMongoId(_id);
    const user = await User.findById(_id);
    //console.log("User => " , user?._id);
    const alreadyHave = await Cart.findOne({orderedBy:user._id});
    //console.log("have -> ", alreadyHave)
    if(alreadyHave){
        await Cart.deleteOne(alreadyHave);
    }
        for(let i = 0 ; i < cart.length ; i++){
            let obj = {};
            obj.product = cart[i]._id;
            obj.count = cart[i].count;
            obj.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec()
            obj.price = getPrice.price;
            products.push(obj);
        }
      //  console.log(products);
      let cartTot = 0;
      for(let i = 0 ; i < products.length ; i++){
        cartTot += products[i].price * products[i].count;
      }
     // console.log(products, cartTot)
     let newCart = await new Cart({
        products,
        cartTotal:cartTot,
        orderedBy: user?._id
     }).save()
     await (await newCart.populate("products.product")).populate("orderedBy")
     res.status(200).json({status: SUCCESS , data : newCart})
})

const getUserCart = asyncHandler(async (req, res, next) => {
const {_id} = req.user;
const userCart = await Cart.findOne({orderedBy:_id}).populate("products.product");
res.status(200).json({status: SUCCESS, data : userCart})
})

const emptyCart = asyncHandler(async(req, res, next) => {
    const {_id} = req.user;
    validateMongoId(_id)
    const deleteCart = await Cart.deleteOne({orderedBy:_id});
    res.status(200).json({status: SUCCESS, data :null})
})

const applyCoupon = asyncHandler(async(req, res, next) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    validateMongoId(_id);
    const validCoupon = await Coupon.findOne({name : coupon})
    if(!validCoupon){
        throw appError.create("Invalid or expired coupon.", 400, FAIL);
    }else{
        const user = await User.findById(_id);
        let {products, cartTotal} = await Cart.findOne({orderedBy: user?._id}).populate("products.product");
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
        await Cart.findOneAndUpdate({orderedBy:user?._id}, {totalAfterDiscount}, {new : true})
        res.json(totAfterDiscount)
    }
})

const createOrder = asyncHandler(async (req, res, next) => {
    const {COD, couponApplied} = req.body;
    const {_id} = req.user;
    validateMongoId(_id);
    if(!COD){
        throw appError.create("Create cash order failed");
    }
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({orderedBy: user?._id});
    let finalAmount = 0;
    if(couponApplied && userCart.totalAfterDiscount){
        finalAmount = userCart.totalAfterDiscount;
    }else{
        finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
            id: uniqid(),
            method:"COD",
            amount: finalAmount,
            status: "Cash on delivery",
            created: Date.now(),
            currency: "usd"
        },
        orderedBy: user?._id,
        orderStatus:"Cash on delivery",
    }).save()
    let update = userCart.products.map(item => {
        return {
            updateOne: {
                filter: {_id:item.product._id},
                update:{$inc: {quantity: -item.count, sold: +item.count}}
            }
        }
    })
    const updated = await Product.bulkWrite(update, {});
    res.json({status: SUCCESS,})
})

const getOrders = asyncHandler(async(req, res, next) => {
    const {_id} = req.user;
    validateMongoId(_id);
    const user = await User.findById(_id);
    const orders = await Order.findOne({orderedBy : user?._id}).populate("products.product orderedBy")
    if(!user)
    {
        throw appError.create("Resource not found.", 404, ERROR);
    }else{
        res.status(200).json({status : SUCCESS, data : orders})
    }
})

const updateOrderStatus = asyncHandler(async(req, res, next) => {
    const {status} = req.body;
    const {id} = req.params;
    validateMongoId(id);
    const order = await Order.findByIdAndUpdate(id, {
        orderStatus: status,
        paymentIntent: {
            status: status
        }
    }, {new : true});
    res.json({status : SUCCESS, data : order})
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
    deleteMyAccount,
    handleRefreshToken,
    logOut,
    changePassword,
    forgotPasswordToken,
    resetPassword,
    adminLogin,
    getWishlist,
    saveAddress,
    userCart,
    emptyCart,
    getUserCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus

}