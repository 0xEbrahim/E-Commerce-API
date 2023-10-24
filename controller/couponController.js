import Coupon from "../models/couponModel.js"
import AsyncHandler from "express-async-handler";
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import appError from '../utils/error.js';
import { validateMongoId } from "../utils/validateMongoDBId.js";

const createCoupon = AsyncHandler(async(req, res, next) => {
    const newCoupon = await Coupon.create({...req.body});
    res.status(201).json({status: SUCCESS, data: newCoupon});
})

const getAllCoupons = AsyncHandler(async(req, res, next) => {
    const coupons = await Coupon.find({});
    res.status(200).json({status:SUCCESS, data: coupons})
})

const getSingleCoupon = AsyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const coupon = await Coupon.findById(id);
    if(!coupon){
        throw appError.create("Resource not found", 404, ERROR)
    }else{
        res.status(200).json({status: SUCCESS, data: coupon})
    }
})

const updateCoupon = AsyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, {...req.body}, {new : true});
    if(!updatedCoupon){
        throw appError.create("Resource not found.", 404, ERROR)
    }else{
        res.status(200).json({status: SUCCESS, data: updatedCoupon})
    }
})

const deleteCoupon = AsyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if(!deletedCoupon){
        throw appError.create("Resource not found.", 404, ERROR)
    }else{
        res.status(200).json({status: SUCCESS, data : null})
    }
})
export {createCoupon, getAllCoupons, updateCoupon, getSingleCoupon, deleteCoupon}