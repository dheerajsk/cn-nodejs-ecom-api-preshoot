import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { categorySchema } from '../features/product/category.schema.js';


dotenv.config();
export const connectUsingMongoose = async ()=>{
    try{
        await mongoose.connect(process.env.DB_CONNECTION,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        console.log("Connected to Mongodb using mongoose");
        addCategories();
    }catch(err){
        console.log(err);
        console.log("Error occurred while connecting usign Mongoose");
    } 
      
}

async function addCategories(){
    const CategoryModel = mongoose.model("Category", categorySchema);
    const categotries = await CategoryModel.find();
   
    if(!categotries || categotries.length==0){
        await CategoryModel.insertMany([{name:'Books'},{name:'Electronics'},{name:'Clothing'}])

    }
}