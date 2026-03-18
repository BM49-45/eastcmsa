import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  // Ensure we always return JSON
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
      return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${session.user.id}-${uuidv4()}.${ext}`
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars")
    await mkdir(uploadDir, { recursive: true })
    
    // Save file
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Generate public URL
    const imageUrl = `/uploads/avatars/${fileName}`

    // Update user in database
    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          image: imageUrl,
          updatedAt: new Date() 
        } 
      }
    )

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: "Profile image uploaded successfully" 
    })

  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")

    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id)
    })

    if (user?.image && user.image.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), "public", user.image)
      try {
        await unlink(filePath)
      } catch (err) {
        console.error("Error deleting file:", err)
      }
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          image: null,
          updatedAt: new Date() 
        } 
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Profile image removed" 
    })

  } catch (error) {
    console.error("Error deleting profile image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}