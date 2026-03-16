import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Fetch from MongoDB
    const contents = await db
      .collection("contents")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(contents)
  } catch (error) {
    console.error("Error fetching contents:", error)
    return NextResponse.json({ error: "Failed to fetch contents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const client = await clientPromise
    const db = client.db("eastcmsa")

    const result = await db.collection("contents").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloads: 0
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}