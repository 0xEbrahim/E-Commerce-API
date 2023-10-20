import mongoose from "mongoose"; // Erase if already required
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
    }
});

userSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.isMatchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Export the model
export default mongoose.model('User', userSchema)