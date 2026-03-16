import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars")
    
    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    const imageUrl = `/uploads/avatars/${fileName}`

    // Update user in database
    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    await db.collection("users").updateOne(
      { email: session.user?.email },
      { $set: { image: imageUrl, updatedAt: new Date() } }
    )

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: "Profile image uploaded successfully" 
    })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}