import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const client = await clientPromise;
    const db = client.db("eastcmsa");

    const usersCount = await db.collection("users").countDocuments();
    const lecturesCount = await db.collection("lectures").countDocuments();

    return NextResponse.json({
      message: "Admin data fetched successfully",
      stats: {
        totalUsers: usersCount,
        totalLectures: lecturesCount,
      },
      admin: {
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error: any) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
