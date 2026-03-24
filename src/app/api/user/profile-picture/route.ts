import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("image") as File
    
    if (!file) {
      return NextResponse.json({ error: "Hakuna picha iliyochaguliwa" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Aina ya faili si sahihi. Tafadhali chagua picha." }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Picha ni kubwa sana. Inapaswa kuwa chini ya 2MB." }, { status: 400 })
    }

    // ✅ Fix: Convert to Uint8Array instead of Buffer
    const bytes = await file.arrayBuffer()
    const uint8Array = new Uint8Array(bytes)
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${session.user.id}-${uuidv4()}.${ext}`
    
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars")
    await mkdir(uploadDir, { recursive: true })
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
    return NextResponse.json({ error: "Hitilafu katika kupakia picha. Tafadhali jaribu tena." }, { status: 500 })
  }
}