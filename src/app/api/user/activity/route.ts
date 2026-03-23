import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const activities = await db.collection("activities")
      .find({ userId: session.user.id })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json(activities.map(a => ({
      id: a._id.toString(),
      type: a.type,
      title: a.title,
      speaker: a.speaker,
      category: a.category,
      timestamp: a.timestamp
    })))
  } catch (error) {
    console.error("Activity API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}