import mongoose from "mongoose";

var cartSchema = new mongoose.Schema({
   products: [{
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    count: {
        type: Number,
        default: 0
    },
    color: String,
    price: Number,
   },],
   cartTotal: Number,
   totalAfterDiscount:Number,
   orderedBy:{
    type: mongoose.Types.ObjectId,
    ref: "User"
   }
}, {
    timestamps: true
});

//Export the model
export default mongoose.model('Cart', cartSchema);