import UserModel from './user.model.js';
import UserRepository from './user.repository.js';
import jwt from 'jsonwebtoken';

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  signUp = async (req, res) => {
    const {
      name,
      email,
      password,
      type,
    } = req.body;

    const userToCreate = new UserModel(name, email, password, type)

    const user = await this.userRepository.signup(userToCreate);
    res.status(201).send(user);
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