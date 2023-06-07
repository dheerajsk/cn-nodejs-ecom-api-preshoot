import { getDB } from '../../configs/db.js';
import { ObjectId } from 'mongodb';

export default class ProductRepository {
  constructor() {
    this.collectionName = 'products'; // name of the collection in mongodb
  }

  async getAll() {
    const db = getDB();
    const products = await db
      .collection(this.collectionName)
      .find({})
      .toArray();
    return products;
  }

  async add(product) {
    const db = getDB();
    const response = await db
      .collection(this.collectionName)
      .insertOne(product);
    return product;
  }

  // async rateProduct(userID, productID, rating) {
  //   const db = getDB();

  //   // 1. Remove existing rating from the same user.
  //   await db
  //     .collection(this.collectionName)
  //     .updateOne(
  //       { _id: new ObjectId(productID) },
  //       { $pull: { ratings: { userID: new ObjectId(userID) } } }
  //     );

  //   // 2. Add new rating.
  //   await db
  //     .collection(this.collectionName)
  //     .updateOne(
  //       { _id: new ObjectId(productID) },
  //       { $push: { ratings: { userID: new ObjectId(userID), rating: parseFloat(rating) } } }
  //     );
  // }

  async rateProduct(userID, productID, rating) {
    const db = getDB();
    const productToUpdate = await db.collection(this.collectionName).findOne({ _id: new ObjectId(productID) });
    const userRating = productToUpdate.ratings.find(rating => rating.userID === userID);
    if (userRating) {
        // User has already rated, update the rating.
        await db.collection(this.collectionName).updateOne(
            { _id: new ObjectId(productID), "ratings.userID": userID },
            { $set: { "ratings.$.rating": rating } }
        );
    } else {
        // New rating.
        await db.collection(this.collectionName).updateOne(
            { _id: new ObjectId(productID) },
            { $push: { ratings: { userID, rating } } }
        );
    }
}



  async getOne(id) {
    const db = getDB();
    const product = await db
      .collection(this.collectionName)
      .findOne({ _id: new ObjectId(id) });
    return product;
  }

  async filter(minPrice, maxPrice, category) {
    const db = getDB();
    const filter = {};
    if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (category) filter.category = category;
    const result = await db
      .collection(this.collectionName)
      .find(filter)
      .toArray();
    return result;
  }
}
