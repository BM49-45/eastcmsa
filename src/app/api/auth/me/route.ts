// src/app/api/auth/me/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
  try {
    // 1️⃣ Get current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Return user info
    return new Response(JSON.stringify({ user: session.user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Hitilafu" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
