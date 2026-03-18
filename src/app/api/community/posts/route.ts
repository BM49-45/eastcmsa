import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
export const dynamic = 'force-dynamic'

// GET /api/communityPosts
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("eastcmsa")

    const posts = await db.collection("community_posts")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: 1,
            userName: "$user.name",
            userRole: "$user.role",
            content: 1,
            likes: { $size: { $ifNull: ["$likedBy", []] } },
            comments: { $size: { $ifNull: ["$comments", []] } },
            createdAt: 1
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray()

    // Map _id to string
    const sanitizedPosts = posts.map(p => ({ ...p, id: p._id.toString() }))

    return NextResponse.json(sanitizedPosts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST /api/communityPosts
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const post = {
      userId: new ObjectId(session.user.id),
      content,
      likedBy: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("community_posts").insertOne(post)

    // Fetch the new post with user info
    const newPost = await db.collection("community_posts")
      .aggregate([
        { $match: { _id: result.insertedId } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: 1,
            userName: "$user.name",
            userRole: "$user.role",
            content: 1,
            likes: 0,
            comments: 0,
            createdAt: 1
          }
        }
      ])
      .next()

    if (!newPost) {
      return NextResponse.json(
        { error: "Post created but failed to fetch details" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ...newPost, id: newPost._id.toString() })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}