import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export type Activity = {
  _id?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  action: string;
  contentId?: string;
  contentTitle?: string;
  contentType?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
};

export async function logActivity(activity: Omit<Activity, '_id' | 'timestamp'>) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const newActivity = {
      ...activity,
      timestamp: new Date()
    };
    
    const result = await db.collection("activities").insertOne(newActivity);
    return result;
  } catch (error) {
    console.error("Error logging activity:", error);
    return null;
  }
}

export async function getActivities(limit = 50) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const activities = await db.collection("activities")
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return activities;
  } catch (error) {
    console.error("Error getting activities:", error);
    return [];
  }
}

export async function getRecentActivities(hours = 24) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const activities = await db.collection("activities")
      .find({ timestamp: { $gte: cutoff } })
      .sort({ timestamp: -1 })
      .toArray();
    
    return activities;
  } catch (error) {
    console.error("Error getting recent activities:", error);
    return [];
  }
}

export async function getUserActivities(userId: string, limit = 20) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const activities = await db.collection("activities")
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return activities;
  } catch (error) {
    console.error("Error getting user activities:", error);
    return [];
  }
}

export async function getContentActivities(contentId: string, limit = 20) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const activities = await db.collection("activities")
      .find({ contentId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    return activities;
  } catch (error) {
    console.error("Error getting content activities:", error);
    return [];
  }
}