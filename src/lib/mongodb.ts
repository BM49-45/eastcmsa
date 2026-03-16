import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error("MONGODB_URI missing")
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the client is preserved
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

// Helper function to get recent activity
export async function getRecentActivity(email: string) {
  try {
    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const activity = await db
      .collection("activity")
      .find({ userEmail: email })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray()
    
    return activity
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return []
  }
}