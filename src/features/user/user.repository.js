// UserRepository.js
import { getDB } from "../../configs/db.js";

class UserRepository {
  async signup(user) {
    const db = getDB();
    await db.collection('users').insertOne(user);
    return user;
  }

  async signin(email, password) {
    const db = getDB();
    const user = await db.collection('users').findOne({ email, password });
    return user;
  }
}

export default UserRepository;
