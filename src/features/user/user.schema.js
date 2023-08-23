import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters long."],
    validate: {
      validator: function(value) {
        // Check for 1 special character
        return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
      },
      message: "Password must have at least 1 special character."
    }
  }
});

export const userOTP = new mongoose.Schema({
  email: String,
  otp: Number,
  expiresOn: Date
})