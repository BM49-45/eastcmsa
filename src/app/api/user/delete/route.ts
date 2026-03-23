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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Get user data
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete profile image if exists
    if (user.image && user.image.startsWith('/uploads/')) {
      try {
        const filePath = path.join(process.cwd(), "public", user.image)
        await unlink(filePath)
      } catch (err) {
        console.error("Error deleting profile image:", err)
      }
    }

    // Delete user data from all collections
    await db.collection("users").deleteOne({ _id: new ObjectId(session.user.id) })
    await db.collection("sessions").deleteMany({ userId: session.user.id })
    await db.collection("activities").deleteMany({ userId: session.user.id })

    return NextResponse.json({ 
      success: true, 
      message: "Account deleted successfully" 
    })

  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}