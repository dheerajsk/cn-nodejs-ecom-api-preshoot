// UserRepository.js
import { getDB } from "../../configs/db.js";

class UserRepositoryOld {
  constructor() {
    this.collectionName = 'users';
  }

  async signup(user) {
    const db = getDB();
    await db.collection(this.collectionName).insertOne(user);
    return user;
  }

  async signin(email, password) {
    const db = getDB();
    const user = await db.collection(this.collectionName).findOne({ email, password });
    return user;
  }
}

export default UserRepository;
