import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    await users.deleteOne({ _id: new (require("mongodb").ObjectId)(session.user.id) });

    return NextResponse.json({ message: "Akaunti imefutwa kwa mafanikio" });
  } catch (err) {
    console.error("Delete Account Error:", err);
    return NextResponse.json({ error: "Hitilafu kwenye server" }, { status: 500 });
  }
}