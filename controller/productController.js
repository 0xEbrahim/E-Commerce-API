import Product from "../models/productModel.js";
import User from '../models/userModel.js'
import AsyncHandler from "express-async-handler";
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import appError from '../utils/error.js';
import { validateMongoId } from "../utils/validateMongoDBId.js";
import slugify from "slugify";


const createProduct = AsyncHandler(async(req, res, next) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
   
    const newProduct = await Product.create(req.body)
    res.status(201).json({status: SUCCESS, data : newProduct})
})

const updateProduct = AsyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const product = await Product.findById(id);
    if(!product){
        throw appError.create("Resource not found", 404 , ERROR);
    }else{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
    const updatedProduct = await Product.findByIdAndUpdate(id, {...req.body},{new:true})
    res.status(200).json({status:SUCCESS,data:updatedProduct});
}
})

const deleteProduct = AsyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const product = await Product.findById(id);
    if(!product){
        throw appError.create("Resource not found", 404 , ERROR);
    }else{
    const deletedProduct = await Product.findByIdAndDelete(id)
    res.status(200).json({status:SUCCESS,data:deletedProduct});
    }
})

const getAllProducts = AsyncHandler(async(req, res , next) => {
    
    // filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));
    
    // sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");
         query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt')
    }
    
    // limiting fields
    if(req.query.fields){
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields)
    }else{
        query = query.select('-__v');
    }

    // pagination
    const limit = req.query.limit ;
    const page = req.query.page ;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page){
        const productCount = await Product.countDocuments();
        if(skip >= productCount){
            throw appError.create("This page does not exist",404,ERROR);
        }
    }

    const products = await query;
    res.status(200).json({status:SUCCESS , data : products})
})

const getSingleProduct = AsyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const product = await Product.findById(id);
    if(!product){
        throw appError.create("Resource not found", 404 , ERROR);
    }else{
        res.status(200).json({status:SUCCESS , data:product})
    }
})

const addToWishlist = AsyncHandler(async (req, res, next) => {
    const {_id : id} = req.user;
    validateMongoId(id);
    const {id : productId} = req.params;
    validateMongoId(productId);
    const user = await User.findByIdAndUpdate(id,{$push: {wishlist : productId}}, {new:true});
    const product = await Product.findById(productId);
    if(!user || !product){
        throw appError.create("Resource not found.", 404 , ERROR);
    }else{
        res.status(200).json({status: SUCCESS, data: user})
    }
})

export {createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct, addToWishlist}