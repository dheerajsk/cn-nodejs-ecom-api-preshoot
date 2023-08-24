import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { ObjectId } from "mongodb";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";


const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {

  async getAll() {
    return await ProductModel.find().populate('categories').populate('reviews');
}

  async add(productData) {
    productData.categories = productData.categories.split(',');
    productData.categories=productData.categories.map(c=> new ObjectId(c.trim()));
    
    const newProduct = new ProductModel(productData);
    await newProduct.save();
    if (productData.categories && productData.categories.length > 0) {
        // For each category in productData.categories, update the category's products array
        for (let categoryId of productData.categories) {
            await CategoryModel.findByIdAndUpdate(categoryId, {
                $push: { products: newProduct._id }
            });
        }
    }

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