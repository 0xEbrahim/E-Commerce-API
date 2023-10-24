import mongoose from "mongoose";
import bcrypt, { hash } from 'bcrypt'
import crypto from 'crypto'

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
    },
    passwordChangedAt : {
        type : Date
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpires:{
        type:Date
    }
},
    {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next){
    if(!this.isModified('password')){
        next();  
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.isMatchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto
                    .randomBytes(32)
                    .toString("hex")
                    
    this.passwordResetToken = crypto
                        .createHash('sha256')
                        .update(resetToken)
                        .digest("hex")
   
    //console.log(resetToken, this.passwordResetToken, hashed);
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
}


//Export the model
export default mongoose.model('User', userSchema)