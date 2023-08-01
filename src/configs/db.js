import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DB_CONNECTION
console.log(url);
const client = new MongoClient(url);
let db = null;

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected successfully.');
    db = client.db('ecomdb');
    createCounter(db);
    createIndexes(db);
  } catch (err) {
    console.error('Unable to connect to the MongoDB server. Error:', err);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Call connectDB first to initialize the database connection');
  }
  return db;
};

const createCounter = async (db) => {
  // Check if the counter document already exists
  const existingCounter = await db.collection('counters').findOne({ _id: 'cartItemId' });

  // If it doesn't exist, create it
  if (!existingCounter) {
    await db.collection('counters').insertOne({ _id: 'cartItemId', sequence_value: 0 });
  }
};


const createIndexes = async(db) => {
  // Single Field Index on productName
  await db.collection('products').createIndex({ productName: 1 });

  // Compound Index on productName and category
  await db.collection('products').createIndex({ productName: 1, category: 1 });

  // Text Index on productName
  await db.collection('products').createIndex({ productName: "text" });
}




