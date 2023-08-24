import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model("Like",likeSchema)

export default class LikeRepository{

    async likeProduct(userId, productID){
        const newLike = new LikeModel({
            user: new ObjectId(userId),
            likeable: new ObjectId(productID),  
            on_model: 'Product'
          });
          await newLike.save();
    }

    async likeCategory(userId, categoryID){
        const newLike = new LikeModel({
            user: new ObjectId(userId),
            likeable: new ObjectId(categoryID),  
            on_model: 'Category'
          });
          await newLike.save();
    }

    async getLikes(type,likeableId){
        return await LikeModel
    .find({ likeable: new ObjectId(likeableId), on_model: type })
    .populate('user')
    .populate({
        path:'likeable', model:type
    });  

    }
}