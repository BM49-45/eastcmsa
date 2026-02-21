// src/app/api/lectures/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const collection = db.collection("lectures"); // collection yako ya lectures

    const lectures = await collection.find({}).toArray();

    return NextResponse.json({ success: true, lectures });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lectures" },
      { status: 500 }
    );
  }
}