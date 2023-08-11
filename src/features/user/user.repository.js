import mongoose from 'mongoose';
import { userSchema } from './user.schema.js';

const UserModel = mongoose.model('User', userSchema);

class UserRepository {

    async signup(user) {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
    }

    async signin(email, password) {
        return await UserModel.findOne({ email, password });
    }
}

export default UserRepository;
