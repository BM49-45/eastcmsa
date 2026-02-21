import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const contents = await db.collection("contents").find({}).toArray();
    
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    const body = await request.json();
    
    const result = await db.collection("contents").insertOne({
      ...body,
      views: 0,
      likes: 0,
      downloads: 0,
      createdAt: new Date()
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}