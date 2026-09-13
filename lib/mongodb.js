import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hooperzclub';

let client;
let clientPromise;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect().catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    return null;
  });
}

clientPromise = globalThis._mongoClientPromise;

export default clientPromise;
