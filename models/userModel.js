import mongoose from "mongoose";
import bcrypt from 'bcrypt'


// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
     
    },
    lastName:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:`user`
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    cart:{
        type:Array,
        default:[]
    },
    address:[{
        type: mongoose.Types.ObjectId,
        ref: "Address"
    }],
    wishlist:[{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken : {
        type:String,
    }
},
    {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.isMatchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Export the model
export default mongoose.model('User', userSchema)