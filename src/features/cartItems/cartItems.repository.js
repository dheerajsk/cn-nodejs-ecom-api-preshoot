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
    
    // Retrieve next sequence number
    const sequenceDocument = await db.collection('counters').findOneAndUpdate(
      { _id: 'cartItemId' }, // search filter
      { $inc: { sequence_value: 1 } }, // update
      { returnOriginal: false } // options
    );
  
    // Now use the sequenceDocument's sequence_value as the _id for your new cartItem
    cartItem._id = sequenceDocument.value.sequence_value;
  
    const filter = { productID: cartItem.productID, userID: cartItem.userID };
    const updateDoc = {
      $setOnInsert: { _id: cartItem._id },  // set _id only on insert, not on update
      $inc: { quantity: cartItem.quantity }
    };
    const options = { upsert: true };
  
    await db.collection(this.collectionName).updateOne(filter, updateDoc, options);
    return cartItem;
  }
  

  async getNextSequenceValue(db) {
  const sequenceDoc = await db.collection('counters').findOneAndUpdate(
    { _id: "cartItemId" },
    { $inc: { sequence_value: 1 }},
    { returnOriginal: false }
  );
  return sequenceDoc.value.sequence_value;
  }

}
