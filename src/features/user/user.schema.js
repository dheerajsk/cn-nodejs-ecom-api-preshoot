import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  type:{
    type: String,
    enum:['Customer', 'Seller']
  }
});

export const userOTP = new mongoose.Schema({
  email: String,
  otp: Number,
  expiresOn: Date
})