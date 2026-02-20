import { getDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

export type Activity = {
  _id?: ObjectId;
  userName: string;
  action: "login" | "logout" | "upload";
  reason?: string;
  contentTitle?: string;
  time: Date;
};

export async function getRecentActivities(limit: number = 10) {
  const db = await getDatabase();
  return db
    .collection<Activity>("activities")
    .find({})
    .sort({ time: -1 })
    .limit(limit)
    .toArray();
}

export async function createActivity(activity: Omit<Activity, "_id">) {
  const db = await getDatabase();
  return db.collection<Activity>("activities").insertOne({
    ...activity,
    time: new Date(),
  });
}
