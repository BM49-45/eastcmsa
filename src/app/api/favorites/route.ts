import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { audioId, audioData } = body

    if (!audioId) {
      return NextResponse.json({ error: "Audio ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Check if already favorited
    const existing = await db.collection("favorites").findOne({
      userId: session.user.id,
      audioId: audioId
    })

    if (existing) {
      // Remove from favorites (toggle)
      await db.collection("favorites").deleteOne({
        _id: existing._id
      })
      return NextResponse.json({ 
        success: true, 
        action: "removed",
        message: "Removed from favorites" 
      })
    } else {
      // Add to favorites
      const result = await db.collection("favorites").insertOne({
        userId: session.user.id,
        audioId: audioId,
        audioData: audioData || {},
        createdAt: new Date()
      })
      
      return NextResponse.json({ 
        success: true, 
        action: "added",
        id: result.insertedId,
        message: "Added to favorites" 
      })
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return NextResponse.json({ error: "Failed to update favorites" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const favorites = await db
      .collection("favorites")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const favoriteId = searchParams.get("id")

    if (!favoriteId) {
      return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const result = await db.collection("favorites").deleteOne({
      _id: new ObjectId(favoriteId),
      userId: session.user.id
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Removed from favorites" })
  } catch (error) {
    console.error("Error deleting favorite:", error)
    return NextResponse.json({ error: "Failed to delete favorite" }, { status: 500 })
  }
}