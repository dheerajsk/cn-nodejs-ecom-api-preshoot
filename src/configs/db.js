import { MongoClient } from 'mongodb';
const url = "mongodb://localhost:27017/mydb";

const connectDB = () => {
  MongoClient.connect(url)
    .then(client => {
      console.log("Database connected!");
      const db = client.db("mydb");
      // Add code here to interact with the database
      client.close();
    })
    .catch(err => console.error(err));
}

export default connectDB;



