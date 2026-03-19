import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {  // ✅ Use NextRequest
  try {
    const { lectureId, text, user } = await req.json()

    if (!lectureId || !text || !user) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Insert comment
    const comment = await db.collection("comments").insertOne({
      lectureId: new ObjectId(lectureId),
      text,
      user,
      createdAt: new Date()
    })

    // Update lecture comments count
    await db.collection("lectures").updateOne(
      { _id: new ObjectId(lectureId) },
      { $inc: { comments: 1 } }
    )

    return NextResponse.json({ 
      success: true,
      commentId: comment.insertedId 
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}