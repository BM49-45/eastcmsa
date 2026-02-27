import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error('Please define MONGODB_URI environment variable')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise