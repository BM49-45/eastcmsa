import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { role, status, isSubscribed, phone, gender, location, name } = await req.json()

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    const updateFields: any = { updatedAt: new Date() }
    if (role !== undefined) updateFields.role = role
    if (status !== undefined) updateFields.status = status
    if (isSubscribed !== undefined) {
      updateFields.isSubscribed = isSubscribed
      if (isSubscribed === true) {
        updateFields.subscribedAt = new Date()
      } else {
        updateFields.subscribedAt = null
      }
    }
    if (phone !== undefined) updateFields.phone = phone
    if (gender !== undefined) updateFields.gender = gender
    if (location !== undefined) updateFields.location = location
    if (name !== undefined) updateFields.name = name

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )

    // If user is being blocked or deactivated, invalidate their sessions
    if (status === 'blocked' || status === 'inactive') {
      // You can add session invalidation logic here
      // For now, we'll rely on the client-side check
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH user error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    // Get user email before deletion to invalidate session
    const userToDelete = await db.collection("users").findOne({ _id: new ObjectId(id) })
    
    await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    // Return the deleted user's email so client can force logout
    return NextResponse.json({ 
      success: true, 
      deletedUserEmail: userToDelete?.email 
    })
  } catch (error) {
    console.error("DELETE user error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}