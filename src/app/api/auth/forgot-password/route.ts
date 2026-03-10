import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Barua pepe inahitajika" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Barua pepe haipo kwenye mfumo" }, { status: 404 });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await users.updateOne(
      { _id: user._id },
      { $set: { resetPasswordToken: token, resetPasswordExpires: expires } }
    );

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"EASTCMSA" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `<p>Bonyeza link hii ili kubadilisha nenosiri lako:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Link hii itakuwa sahihi kwa masaa 1 tu.</p>`
    });

    return NextResponse.json({ message: "Tumeituma barua pepe ya reset password" });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json({ error: "Hitilafu kwenye server" }, { status: 500 });
  }
}