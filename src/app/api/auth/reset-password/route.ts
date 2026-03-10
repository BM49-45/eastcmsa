import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token na password vinahitajika" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password lazima iwe na herufi 8 au zaidi" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Token si sahihi au imeisha muda wake" }, { status: 400 });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await users.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { resetPasswordToken: "", resetPasswordExpires: "" } }
    );

    return NextResponse.json({ message: "Password imebadilishwa kwa mafanikio" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return NextResponse.json({ error: "Hitilafu kwenye server" }, { status: 500 });
  }
}