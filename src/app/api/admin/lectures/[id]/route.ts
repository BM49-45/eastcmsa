import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/lectures/[id] - Get single lecture
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params // ✅ Must await params

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const lecture = await db.collection("lectures").findOne({
      _id: new ObjectId(id)
    })

    if (!lecture) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 })
    }

    return NextResponse.json(lecture)
  } catch (error) {
    console.error("Error fetching lecture:", error)
    return NextResponse.json(
      { error: "Failed to fetch lecture" },
      { status: 500 }
    )
  }
}

// PUT /api/lectures/[id] - Update lecture
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const result = await db.collection("lectures").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating lecture:", error)
    return NextResponse.json(
      { error: "Failed to update lecture" },
      { status: 500 }
    )
  }
}

// DELETE /api/lectures/[id] - Delete lecture
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const result = await db.collection("lectures").deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lecture:", error)
    return NextResponse.json(
      { error: "Failed to delete lecture" },
      { status: 500 }
    )
  }
}