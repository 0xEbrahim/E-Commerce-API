import mongoose from "mongoose";

var prodCategorySchema = new mongoose.Schema({
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
export default mongoose.model("prodCategory", prodCategorySchema)