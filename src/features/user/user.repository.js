import mongoose from 'mongoose';
import { userOTP, userSchema } from './user.schema.js';
import { sendOTPviaEmail } from '../../external/mail.service.js';

const UserModel = mongoose.model('User', userSchema);
const OTPModel = mongoose.model('UserOTP', userOTP);

class UserRepository {

    async signup(user) {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
    }

    async signin(email, password) {
        return await UserModel.findOne({ email, password });
    }

    async sendOTP(email) {
        const otp = this.generateOTP();
        await OTPModel.create({ email, otp, expiry: Date.now() + 300000 });  // OTP expires in 5 mins
        sendOTPviaEmail(email, otp)
    }

    async resetPassword(email, userOTP, newPassword){
        const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) return "No OTP found. Request a new one.";
    if (otpRecord.otp !== userOTP) return "Invalid OTP.";
    if (otpRecord.expiry < Date.now()) return "OTP has expired.";
    
    const user = await UserModel.findOne({ email });
    if (!user) return "User not found.";

    user.password = newPassword;
    await user.save();
    await OTPModel.deleteOne({ email });
    return "Password updated successfully!";
    }

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();  
    }
    
}

export default UserRepository;
