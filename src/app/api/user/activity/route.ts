import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic';

// Log activity when user downloads audio
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, contentId, title, speaker, category } = await req.json()

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    await db.collection("activities").insertOne({
      userId: session.user.id,
      type, // 'download', 'view', 'like'
      contentId,
      title,
      speaker,
      category,
      timestamp: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Activity log error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}