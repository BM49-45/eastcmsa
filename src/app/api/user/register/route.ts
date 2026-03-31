import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { name, email, phone, gender, location, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Jaza taarifa zote muhimu" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Neno la siri lazima iwe na herufi 6 au zaidi" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Barua pepe tayari ipo" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await db.collection("users").insertOne({
      name,
      email,
      phone: phone || "",
      gender: gender || "",
      location: location || "",
      password: hashedPassword,
      role: "user",
      status: "active",
      isSubscribed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date()
    })

    // Record registration analytics (frontend will handle this via localStorage)
    // But we can also record in MongoDB activities collection
    await db.collection("activities").insertOne({
      userId: result.insertedId.toString(),
      userName: name,
      type: "register",
      timestamp: new Date()
    })

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Akaunti imeundwa kikamilifu" 
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Imeshindwa kujisajili" }, { status: 500 })
  }
}