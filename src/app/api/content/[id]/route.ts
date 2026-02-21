import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // params ni Promise
) {
  try {
    const { id } = await params;  // Subiri Promise
    const client = await clientPromise;
    const db = client.db("eastcmsa");
    
    const result = await db.collection("contents").deleteOne({
      _id: new ObjectId(id)
    });
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}