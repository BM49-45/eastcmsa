import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Barua pepe inahitajika" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    
    if (!user) {
      // Kwa usalama, usionyeshe kama email haipo
      return NextResponse.json(
        { message: "Kama barua pepe ipo, utapokea maelekezo ya kubadilisha nenosiri" },
        { status: 200 }
      );
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetPasswordToken: token, 
          resetPasswordExpires: expires 
        } 
      }
    );

    // SMTP configuration - tumia environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"EASTCMSA" <${process.env.SMTP_USER || "noreply@eastcmsa.com"}>`,
      to: email,
      subject: "Reset Password - EASTCMSA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Badilisha Nenosiri</h2>
          <p>Umepokea barua pepe hii kwa sababu umeomba kubadilisha nenosiri lako.</p>
          <p>Bonyeza link hapa chini ili kuendelea:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Badilisha Nenosiri
          </a>
          <p>Au nakili link hii kwenye browser yako:</p>
          <p style="background-color: #f3f4f6; padding: 10px; word-break: break-all;">
            ${resetUrl}
          </p>
          <p>Link hii itakuwa sahihi kwa <strong>masaa 1</strong> tu.</p>
          <p>Kama hukuomba kubadilisha nenosiri, tafadhali puuza barua pepe hii.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">
            © ${new Date().getFullYear()} EASTCMSA. Haki zote zimehifadhiwa.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Tumeituma barua pepe ya reset password" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json(
      { error: "Hitilafu kwenye server. Tafadhali jaribu tena." },
      { status: 500 }
    );
  }
}