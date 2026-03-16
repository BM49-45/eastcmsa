import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const users = await db
      .collection("users")
      .find({})
      .project({ password: 0 }) // Don't return passwords
      .toArray()

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
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

    // Check if user already exists
    const existing = await db.collection("users").findOne({ email: body.email })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password (using bcrypt)
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const result = await db.collection("users").insertOne({
      ...body,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}