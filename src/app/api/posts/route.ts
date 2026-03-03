// src/app/api/posts/route.ts
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa"); // replace with your DB name
    const posts = await db.collection("posts").find().toArray();
    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }
}