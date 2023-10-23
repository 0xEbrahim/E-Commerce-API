import mongoose from 'mongoose';

import appError from './error.js'
import { ERROR } from './errorText.js';


const validateMongoId = (id)=>{
   const isValid = mongoose.Types.ObjectId.isValid(id);
   if(!isValid){
    throw appError.create("Invalid id.",400,ERROR);
   }
}

export {validateMongoId};