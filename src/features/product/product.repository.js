import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { ObjectId } from "mongodb";


const ProductModel = mongoose.model("Product", productSchema);

class ProductRepository {

  async getAll() {
    return await ProductModel.find();
  }

  async add(product) {
    const newProduct = new ProductModel(product);
    await newProduct.save();
    return newProduct;
  }

  async averagePricePerCategory() {
    return await ProductModel.aggregate([
      {
        $group: {
          _id: "$category",
          averagePrice: { $avg: "$price" }
        }
      }
    ]);
  }

  async rateProduct(userID, productID, rating) {
    console.log(productID);
    console.log(userID);
    const productToUpdate = await ProductModel.findById(new ObjectId(productID));
    console.log(productToUpdate.ratings);
    const userRating = productToUpdate?.ratings?.find(rating => rating.userID === new ObjectId(userID));
    if (userRating) {
        userRating.rating = rating;
    } else {
      console.log("sd");
      console.log(productToUpdate.ratings);
      if(!productToUpdate.ratings){
        console.log("sda");
        productToUpdate.ratings=[];
      }
        productToUpdate.ratings.push({ userID, rating });
        console.log(productToUpdate);
    }
    console.log(productToUpdate);
    await productToUpdate.save();
  }

  async getOne(id) {
    return await ProductModel.findById(id);
  }

  async filter(minPrice, maxPrice, categories) {
    let filter = {};

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    if (categories) {
      filter.category = { $in: categories };
    }

    return await ProductModel.find(filter).select('-_id');  // exclude _id
  }

}

export default ProductRepository;