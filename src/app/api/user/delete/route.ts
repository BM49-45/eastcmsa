import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { unlink } from "fs/promises"
import path from "path"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Get user data first
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      )
    }

    // Delete profile image if exists
    if (user?.image && user.image.startsWith('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), "public", user.image)
        await unlink(filePath)
      } catch (imageError) {
        console.error("Error deleting profile image:", imageError)
      }
    }

    // Delete user data from all collections
    await Promise.all([
      db.collection("users").deleteOne({ _id: new ObjectId(session.user.id) }),
      db.collection("activities").deleteMany({ userId: session.user.id }),
      db.collection("favorites").deleteMany({ userId: session.user.id }),
      db.collection("playlists").deleteMany({ userId: session.user.id }),
      db.collection("comments").deleteMany({ userId: session.user.id }),
    ])

    return NextResponse.json({ 
      success: true, 
      message: "Account deleted successfully" 
    })

  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}