import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017/');
let db = null;

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected successfully.');
    db = client.db('myecomdb');
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




