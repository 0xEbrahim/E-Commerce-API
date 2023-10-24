import mongoose from "mongoose";

var colorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
},
{
  timestamps: true,
});

//Export the model
export default mongoose.model('Color', colorSchema);