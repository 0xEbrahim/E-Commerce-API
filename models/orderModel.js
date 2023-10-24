import mongoose from "mongoose";

var orderSchema = new mongoose.Schema({
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
   }],
   paymentIntent: {

   },
   orderStatus: {
    type: String,
    default:"Not processed yet.",
    enum: ["Not processed yet.", "Cash on delivery", "Processing", "Cancelled", "Delivered"]
   },
   orderedBy:{
    type: mongoose.Types.ObjectId,
    ref: "User"
   }
}, {
    timestamps: true
});

//Export the model
export default mongoose.model('Order', orderSchema);