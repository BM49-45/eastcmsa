import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic';

// POST /api/community/posts/[id]/reactions - Add/remove reaction
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { type } = await req.json() // 'like', 'love', 'laugh', etc.

    const client = await clientPromise
    const db = client.db("eastcmsa")
    const posts = db.collection("community_posts")

    const post = await posts.findOne({ _id: new ObjectId(id) })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user already reacted
    const reactions = post.reactions || {}
    const userReaction = reactions[session.user.id]

    if (userReaction === type) {
      // Remove reaction
      delete reactions[session.user.id]
    } else {
      // Add reaction
      reactions[session.user.id] = type
    }

    await posts.updateOne(
      { _id: new ObjectId(id) },
      { $set: { reactions, updatedAt: new Date() } }
    )

    return NextResponse.json({ 
      success: true, 
      reactions: Object.values(reactions).reduce((acc: any, val: any) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
      }, {})
    })
  } catch (error) {
    console.error("Reaction error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// DELETE /api/community/posts/[id] - Admin delete post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    await db.collection("community_posts").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true, message: "Post deleted" })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// PUT /api/community/posts/[id] - Admin edit post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { content } = await req.json()

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    await db.collection("community_posts").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          content, 
          edited: true,
          editedAt: new Date(),
          updatedAt: new Date() 
        } 
      }
    )

    return NextResponse.json({ success: true, message: "Post updated" })
  } catch (error) {
    console.error("Edit post error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}