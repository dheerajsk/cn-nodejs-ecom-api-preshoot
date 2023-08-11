import UserModel from './user.model.js';
import UserRepository from './user.repository.js';
import jwt from 'jsonwebtoken';

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  signUp = async (req, res, next) => {
    try{
      const user = await this.userRepository.signup(req.body);
      res.status(201).send(user);
    }catch(err){
      next(err);
    }  
  }

  getOTP = async (req, res, next) => {
    try{
      const email=req.query.email
      await this.userRepository.sendOTP(email);
      res.status(200).send("OTP sent");
    }catch(err){
      next(err);
    }  
  }

  resetPassword = async (req, res, next) => {
    try{
      const {otp, password, email}=req.body
      await this.userRepository.resetPassword(email, otp, password);
      res.status(200).send("Password is updated");
    }catch(err){
      next(err);
    }  
  }

  signIn = async (req, res) => {
    const result = await this.userRepository.signin(
      req.body.email,
      req.body.password
    );

    if (!result) {
      res
        .status(400)
        .send('Incorrect Credentials');
    } else {
      // 1. Create token.
      const token = jwt.sign(
        {
          userID: result._id,
          email: result.email,
        },
        "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
        {
          expiresIn: '1h',
        }
      );

      // 2. Send token.
      res.status(200).send(token);
    }
  }
}