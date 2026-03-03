import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  createdAt?: Date;
};

const DB_NAME = "eastcmsa";
const COLLECTION = "users";

export async function getUsersCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<User>(COLLECTION);
}

export async function getUserByEmail(email: string) {
  const users = await getUsersCollection();
  return users.findOne({ email });
}

export async function createUser(user: User) {
  const users = await getUsersCollection();
  return users.insertOne({
    ...user,
    createdAt: new Date(),
  });
}
