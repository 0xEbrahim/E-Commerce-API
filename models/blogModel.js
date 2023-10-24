import mongoose from "mongoose";

var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default : 0
    },
    images:[],
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked : {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: "https://thumbs.dreamstime.com/z/blog-information-website-concept-workplace-background-text-view-above-127465079.jpg?w=992"
    },
    author: {
        type: String,
        default: "Admin"
    }
},{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

//Export the model
export default mongoose.model("blog",blogSchema);