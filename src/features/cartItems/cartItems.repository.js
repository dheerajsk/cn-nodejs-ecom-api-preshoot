import { getDB } from '../../configs/db.js';
import { ObjectId } from 'mongodb';

export default class CartItemsRepository {
  constructor() {
    this.collectionName = 'cartItems';
  }

  async getItemsForUser(userID) {
    const db = getDB();
    const items = await db
      .collection(this.collectionName)
      .find({ userID: new ObjectId(userID) })
      .toArray();
    return items;
  }

  async deleteItem(userID, productID) {
    const db = getDB();
    const result = await db
      .collection(this.collectionName)
      .deleteOne({ userID: new ObjectId(userID), productID: new ObjectId(productID) });
    return result.deletedCount > 0;
  }

  async addItem(cartItem) {
    const db = getDB();
    await db.collection(this.collectionName).insertOne(
      {productID: new ObjectId(cartItem.productID),
       userID: new ObjectId(cartItem.userID),
       quantity:1
    });
    return cartItem;
  }
}
