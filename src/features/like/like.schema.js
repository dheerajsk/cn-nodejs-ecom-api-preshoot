import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // this defines the object id of the liked object - Product / Category
  likeable: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'on_model'
  },
  on_model: {
    type: String,
    required: true,
    enum: ['Product', 'Category']
  }
});

