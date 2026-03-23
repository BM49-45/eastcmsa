import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("image") as File
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    // ✅ Fix: Use Uint8Array instead of Buffer
    const bytes = await file.arrayBuffer()
    const uint8Array = new Uint8Array(bytes)
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${session.user.id}-${uuidv4()}.${ext}`
    
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars")
    await mkdir(uploadDir, { recursive: true })
    
    // ✅ Write Uint8Array directly (works with writeFile)
    await writeFile(path.join(uploadDir, filename), uint8Array)

    const imageUrl = `/uploads/avatars/${filename}`

    const client = await clientPromise
    const db = client.db("eastcmsa")
    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { image: imageUrl, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const client = await clientPromise
    const db = client.db("eastcmsa")
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) })

    if (user?.image && user.image.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", user.image)
      try {
        await unlink(filePath)
      } catch (err) {
        console.error("Error deleting file:", err)
      }
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { image: null, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}