import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    // Use a simple object for query - TypeScript workaround
    const settings = await db.collection("community_settings").findOne({ _id: "settings" as any })
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        isLocked: false,
        onlyAdminsCanPost: false,
        announcementsOnly: false,
        welcomeMessage: "Karibu kwenye Jumuiya ya EASTCMSA! Tafadhali heshimu wengine na epuka matusi."
      })
    }

    // Safe access with null checks using optional chaining
    return NextResponse.json({
      isLocked: settings?.isLocked ?? false,
      onlyAdminsCanPost: settings?.onlyAdminsCanPost ?? false,
      announcementsOnly: settings?.announcementsOnly ?? false,
      welcomeMessage: settings?.welcomeMessage ?? ""
    })
  } catch (error) {
    console.error("Error loading community settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isLocked, onlyAdminsCanPost, announcementsOnly, welcomeMessage } = await req.json()

    const client = await clientPromise
    const db = client.db("eastcmsa")
    
    // Use as any to bypass TypeScript strict checking
    await db.collection("community_settings").updateOne(
      { _id: "settings" as any },
      { 
        $set: { 
          isLocked, 
          onlyAdminsCanPost, 
          announcementsOnly, 
          welcomeMessage,
          updatedAt: new Date(),
          updatedBy: session.user.id
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving community settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}