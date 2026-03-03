import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

const registerSchema = z.object({
  name: z.string().min(2, "Jina lazima liwe na herufi 2 au zaidi"),
  email: z.string().email("Barua pepe si sahihi"),
  password: z.string().min(8, "Password lazima iwe na herufi 8 au zaidi"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email tayari imesajiliwa" }, { status: 400 });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const result = await users.insertOne({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Usajili umefanikiwa",
      userId: result.insertedId,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Tatizo la server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
