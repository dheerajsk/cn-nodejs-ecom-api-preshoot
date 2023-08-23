import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    unique: true
  },
  category: {
    type: String,
    required: [true, "Category name is required."],
    unique: true
  },
  sku: {
    type: String,
    required: true,
    match: [/^SKU-\d{3,}$/, "SKU must start with 'SKU-' followed by at least three digits."]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number."]
  },
  description: {
    type: String,
    minlength: [10, "Description must be at least 10 characters."],
    maxlength: [200, "Description can't exceed 200 characters."]
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});
