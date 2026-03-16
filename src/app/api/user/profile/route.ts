import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, bio, location, website, phone, occupation, education } = body;

    // Validate
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    // Check if email exists for another user
    const existingUser = await users.findOne({ 
      email, 
      _id: { $ne: new ObjectId(session.user.id) } 
    });
    
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Update user
    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          name, 
          email, 
          bio: bio || "", 
          location: location || "", 
          website: website || "",
          phone: phone || "",
          occupation: occupation || "",
          education: education || "",
          updatedAt: new Date() 
        } 
      }
    );

    return NextResponse.json({ 
      success: true,
      message: "Profile updated successfully" 
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { password: 0 } } // Don't return password
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}