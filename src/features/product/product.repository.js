import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { ObjectId } from "mongodb";
import { reviewSchema } from "./review.schema.js";


const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);

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
    // First, check if the product exists
    const productToUpdate = await ProductModel.findById(new ObjectId(productID));
    if (!productToUpdate) {
        throw new Error("Product not found!");
    }
    
    // Try to find a review by this user for this product
    const userReview = await ReviewModel.findOne({ product: new ObjectId(productID), userID: new ObjectId(userID) });

    if (userReview) {
        // If the review exists, just update the rating
        userReview.rating = rating;
        await userReview.save();
    } else {
        // Otherwise, create a new review
        const newReview = new ReviewModel({
            product: new ObjectId(productID),
            userID: new ObjectId(userID),
            rating: rating
        });
        await newReview.save();
    }
  }

  async getOne(id) {
    return await ProductModel.findById(id)
                             .populate({
                                 path: 'reviews', 
                                 model: 'Review'
                             });
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