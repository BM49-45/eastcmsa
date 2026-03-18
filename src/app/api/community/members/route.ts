import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("eastcmsa")

    const members = await db.collection("users")
      .aggregate([
        {
          $lookup: {
            from: "community_posts",
            localField: "_id",
            foreignField: "userId",
            as: "posts"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            role: 1,
            avatar: 1,
            joinedAt: "$createdAt",
            postsCount: { $size: "$posts" },
            commentsCount: 0
          }
        },
        { $sort: { postsCount: -1 } }
      ])
      .toArray()

    return NextResponse.json(members.map(m => ({ ...m, id: m._id.toString() })))
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}