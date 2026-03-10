import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Jina na email vinahitajika" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    // Check email duplicate
    const existingUser = await users.findOne({ email, _id: { $ne: new ObjectId(session.user.id) } });
    if (existingUser) {
      return NextResponse.json({ error: "Email tayari imesajiliwa" }, { status: 400 });
    }

    const updateData: any = { name, email };
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: "Password lazima iwe na herufi 8 au zaidi" }, { status: 400 });
      }
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateData }
    );

    return NextResponse.json({ message: "Mipangilio imesasishwa kwa mafanikio" });
  } catch (err) {
    console.error("User Settings PUT Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}