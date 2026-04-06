import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Hii ni response ya mfano ili kujaribu kama API ipo.
export async function GET() {
  return NextResponse.json({ message: "API ya community inafanya kazi!" });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Haujaingia" }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: "Ujumbe hauna maandishi" }, { status: 400 });
  }

  // Hapa utaweka kanuni ya kuhifadhi kwenye MongoDB baadae.
  return NextResponse.json({ success: true, text, user: session.user });
}