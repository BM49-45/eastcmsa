import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// DELETE - Soft delete a message (admin or owner)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const message = await db.collection("community_messages").findOne({ _id: new ObjectId(id) })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Check if user is admin or message owner
    const isAdmin = session.user.role === "admin"
    const isOwner = message.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.collection("community_messages").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE message error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

// PATCH - Edit message (owner only)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { text } = await req.json()

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const message = await db.collection("community_messages").findOne({ _id: new ObjectId(id) })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Only message owner can edit
    if (message.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden - Only owner can edit" }, { status: 403 })
    }

    await db.collection("community_messages").updateOne(
      { _id: new ObjectId(id) },
      { $set: { text: text.trim(), editedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH message error:", error)
    return NextResponse.json({ error: "Failed to edit message" }, { status: 500 })
  }
}