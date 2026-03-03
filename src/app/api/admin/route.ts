// src/app/api/admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const stats = {
      users: await db.collection("users").countDocuments(),
      content: await db.collection("contents").countDocuments(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}