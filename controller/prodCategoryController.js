import prodCategory from "../models/prodCategoryModel.js"
import asyncHandler from 'express-async-handler';
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import appError from '../utils/error.js';
import { validateMongoId } from "../utils/validateMongoDBId.js";

const createCategory = asyncHandler(async (req, res, next) => {
    const newCategory = await prodCategory.create({...req.body});
    res.status(201).json({status: SUCCESS, data: newCategory})
})

const updateCategory = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const updatedCat = await prodCategory.findByIdAndUpdate(id,{...req.body}, {new: true});
    if(!updateCategory){
        throw appError.create("resource not found.", 404, FAIL);
    }else{
        res.status(200).json({status:SUCCESS, data:updatedCat});
    }
})

const deleteCategory = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const deletedCat = await prodCategory.findByIdAndDelete(id);
    if(!deletedCat){
        throw appError.create("Resource not found.", 404, FAIL)
    }else{
    res.status(200).json({status: SUCCESS, data: null})
}})

const getAllCategories = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const categories = await prodCategory.find({}).skip(skip).limit(limit);
    res.status(200).json({status: SUCCESS, data: categories})
})

const getSingleCategory = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const category = await prodCategory.findById(id);
    if(!category){
        throw appError.create("Resource not found.", 404, FAIL);
    }else{
        res.status(200).json({status: SUCCESS, data: category});
    }
})
export {createCategory,updateCategory, deleteCategory, getAllCategories, getSingleCategory}