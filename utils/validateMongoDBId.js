import mongoose, { mongo } from 'mongoose';
import asyncHandler from 'express-async-handler';
import appError from './error.js'
const validateMongoId = (id)=>{
   const isValid = mongoose.Types.ObjectId.isValid(id);
   if(!isValid){
    throw appError.create("Invalid id.",400,ERROR);
   }
}

export {validateMongoId};