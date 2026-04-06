import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Retrieve all messages
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    // Check if collection exists, if not create it
    const collections = await db.listCollections({ name: "community_messages" }).toArray()
    if (collections.length === 0) {
      await db.createCollection("community_messages")
    }
    
    const messages = await db.collection("community_messages")
      .find({ isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      text: msg.text,
      userId: msg.userId,
      userName: msg.userName,
      userImage: msg.userImage || null,
      createdAt: msg.createdAt,
      editedAt: msg.editedAt || null,
      isEdited: !!msg.editedAt
    }))

    return NextResponse.json(formattedMessages.reverse())
  } catch (error) {
    console.error("GET messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Send a new message
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 })
    }

    const { text } = await req.json()

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
    }

    if (text.length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 characters)" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const message = {
      text: text.trim(),
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || null,
      createdAt: new Date().toISOString(),
      isDeleted: false,
      isEdited: false
    }

    const result = await db.collection("community_messages").insertOne(message)

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...message
    }, { status: 201 })
  } catch (error) {
    console.error("POST message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// DELETE - Soft delete a message (admin only)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const messageId = searchParams.get("id")

    if (!messageId) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    await db.collection("community_messages").updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { isDeleted: true, deletedAt: new Date().toISOString() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE message error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

// PATCH - Edit a message (owner only)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messageId, text } = await req.json()

    if (!messageId || !text || text.trim() === "") {
      return NextResponse.json({ error: "Message ID and text required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const message = await db.collection("community_messages").findOne({ _id: new ObjectId(messageId) })

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Only owner can edit
    if (message.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden - You can only edit your own messages" }, { status: 403 })
    }

    await db.collection("community_messages").updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { text: text.trim(), editedAt: new Date().toISOString(), isEdited: true } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH message error:", error)
    return NextResponse.json({ error: "Failed to edit message" }, { status: 500 })
  }
}