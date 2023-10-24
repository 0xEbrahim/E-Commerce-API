import mongoose from "mongoose";

var blogCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index: true
    },
},{
    timestamps: true
});

//Export the model
export default mongoose.model("blogCategory", blogCategorySchema)