import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();
export const connectUsingMongoose = async ()=>{
    try{
        await mongoose.connect(process.env.DB_CONNECTION,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        console.log("Connected to Mongodb using mongoose");
    }catch(err){
        console.log(err);
        console.log("Error occurred while connecting usign Mongoose");
    } 
      
}