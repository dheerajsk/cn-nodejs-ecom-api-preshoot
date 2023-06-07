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

  async rateProduct(userID, productID, rating) {
    const db = getDB();
    const response = await db
      .collection(this.collectionName)
      .updateOne(
        { _id: new ObjectId(productID) },
        { $push: { ratings: { userID, rating } } }
      );
    return response;
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
