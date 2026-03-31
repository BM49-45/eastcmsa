import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 })
    }
    
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const users = await db.collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    // Format users for frontend
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      location: user.location || "",
      role: user.role || "user",
      status: user.status || "active",
      isSubscribed: user.isSubscribed || false,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("GET users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}