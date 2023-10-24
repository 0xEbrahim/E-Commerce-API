import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import appError from '../utils/error.js'
import { ERROR, FAIL, SUCCESS } from '../utils/errorText.js';
import { validateMongoId } from '../utils/validateMongoDBId.js';
import cloudinaryUpload from '../utils/cloudinary.js';
import fs from 'fs'

const createBlog = asyncHandler(async (req, res, next) => {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({status: SUCCESS, data: newBlog});
})

const getAllBlogs = asyncHandler(async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const blogs = await Blog
    .find({}, {__v : false})
    .limit(limit)
    .skip(((page - 1) * limit));

    res.json({status:SUCCESS, data : {blogs}});
})

const getSingleBlog = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const blog = await Blog.findById(id)
    .populate('likes')
    .populate('dislikes');
    if(!blog){
        throw appError.create("Resource not found.", 404 , ERROR);
    }else{
         await Blog.findByIdAndUpdate(id,{$inc: {numViews: 1}}, {new: true})
        res.status(200).json({status : SUCCESS, data: blog})
    }
})

const deleteBlog = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if(!deletedBlog){
        throw appError.create("Resource not found", 404, FAIL);
    }else{
        res.status(200).json({status: SUCCESS, data : deletedBlog});
    }
})

const updateBlog = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    validateMongoId(id);
    const updatedBlog = await Blog.findByIdAndUpdate(id,{...req.body},{new : true});
    if(!updatedBlog){
        throw appError.create("Resource not found", 404, FAIL);
    }else{
        res.status(200).json({status: SUCCESS, data: updatedBlog});
    }
})


const likeBlog = asyncHandler(async (req, res, next) => {
    let LikeTheBlog;
    const {id} = req.params;
    validateMongoId(id)
    const blog = await Blog.findById(id);
    const loginUserId = req?.user?._id;
    if(!blog){
        throw appError.create("Resource not found", 404, ERROR);
    }else{
       const isLiked =  blog?.isLiked;
       const isDisLiked = blog?.dislikes?.find(
        userId => userId?.toString() === loginUserId?.toString()
       );

       if(isDisLiked){
        LikeTheBlog = await Blog.findByIdAndUpdate(id, 
            {$pull:{
                dislikes:loginUserId
            },
            isDisliked:false
        }, 
            {
                new: true
            })
       }
       if(isLiked){
        LikeTheBlog = await Blog.findByIdAndUpdate(id, 
            {$pull:{
                likes:loginUserId
            },
            isLiked:false
        }, 
            {
                new: true
            })
       }else{
        LikeTheBlog = await Blog.findByIdAndUpdate(id, 
            {$push:{
                likes:loginUserId
            },
            isLiked:true
        }, 
            {
                new: true
            })
    }
    res.status(200).json({status: SUCCESS , data: LikeTheBlog})
}})

const unlikeBlog = asyncHandler(async (req, res, next) => {

    let disLikeTheBlog;
    const {id} = req.params;
    validateMongoId(id)
    const blog = await Blog.findById(id);
    const loginUserId = req?.user?._id;
    if(!blog){
        throw appError.create("Resource not found", 404, ERROR);
    }else{
       const isDisLiked =  blog?.isDisliked;
       const isLiked = blog?.likes?.find(
        userId => userId?.toString() === loginUserId?.toString()
       );
       if(isLiked){
       await Blog.findByIdAndUpdate(id, 
            {$pull:{
                likes:loginUserId
            },
            isLiked:false
        }, 
            {
                new: true
            })
       }
       if(isDisLiked){
        disLikeTheBlog = await Blog.findByIdAndUpdate(id, 
            {$pull:
                {
                dislikes:loginUserId
            },
            isDisliked:false
        }, 
            {
                new: true
            })
       }else{
        disLikeTheBlog = await Blog.findByIdAndUpdate(id, 
            {
                $push:{
                    dislikes:loginUserId
            },
            isDisliked:true
        }, 
            {
                new: true
            })
    }
    res.status(200).json({status: SUCCESS , data: disLikeTheBlog})
}
}) 

const uploadImages = asyncHandler(async(req, res ,next) => {
    const {id} = req.params;
    validateMongoId(id);
    const uploader = (pth) => cloudinaryUpload(pth, "images");
        const url = [];
        const files = req.files;
        //console.log("files " , files)
        for(const file of files){
            const {path: pth} = file;
            //console.log("LST => path" , pth);
            const newPath = await uploader(pth);
           // console.log("NEW => ",newPath)                       
            url.push(newPath)
            fs.unlinkSync(pth);
        }
    const findBlog = await Blog.findByIdAndUpdate(id, {images: url.map(file=>{return file}), },{new : true})
    res.status(200).json({status: SUCCESS, data : findBlog})
})

export {createBlog, uploadImages,  getAllBlogs, getSingleBlog, deleteBlog, updateBlog, likeBlog, unlikeBlog}