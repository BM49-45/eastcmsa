import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface Stats {
  _id: string;
  users: number;
  lectures: number;
  books: number;
  plays: number;
  tawhid: number;
  siirah: number;
  fiqh: number;
  mihadhara: number;
  students: number;
  updatedAt: Date;
}

const DEFAULT_STATS: Stats = {
  _id: "main",
  users: 150,
  lectures: 30,
  books: 12,
  plays: 1250,
  tawhid: 18,
  siirah: 3,
  fiqh: 1,
  mihadhara: 8,
  students: 500,
  updatedAt: new Date(),
};

/* =========================
   GET STATS
========================= */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const collection = db.collection<Stats>("stats");

    // pata stats, kama hakuna tengeneza ya mwanzo
    let stats = await collection.findOne({ _id: "main" });

    if (!stats) {
      await collection.insertOne(DEFAULT_STATS);
      stats = DEFAULT_STATS;
    }

    const now = new Date();
    const hour = now.getHours();
    const timeMultiplier = hour >= 8 && hour <= 20 ? 1.2 : 1;

    const enhancedStats = {
      users: Math.floor(stats.users * timeMultiplier),
      lectures: Math.floor(stats.lectures * timeMultiplier),
      books: stats.books,
      plays: Math.floor(stats.plays * (timeMultiplier + 0.5)),
      tawhid: stats.tawhid,
      siirah: stats.siirah,
      fiqh: stats.fiqh,
      mihadhara: stats.mihadhara,
      students: Math.floor(stats.students * timeMultiplier),
    };

    return NextResponse.json({
      success: true,
      message: "Program statistics",
      ...enhancedStats,
      summary: {
        totalSubjects:
          enhancedStats.tawhid +
          enhancedStats.siirah +
          enhancedStats.fiqh +
          enhancedStats.mihadhara,
        totalStudents: enhancedStats.students,
        lastUpdated: stats.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE STATS
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const collection = db.collection<Stats>("stats");

    await collection.updateOne(
      { _id: "main" },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Stats updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error updating stats" },
      { status: 400 }
    );
  }
}
