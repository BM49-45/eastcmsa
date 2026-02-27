// app/api/content/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('eastcmsa')
    
    const content = await db.collection('content').find({}).toArray()
    
    // Convert MongoDB ObjectIds to strings for client-side use
    const formattedContent = content.map(item => ({
      ...item,
      _id: item._id.toString()
    }))
    
    return NextResponse.json(formattedContent)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db('eastcmsa')
    
    // Add timestamps
    const contentToInsert = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      downloads: 0
    }
    
    const result = await db.collection('content').insertOne(contentToInsert)
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        ...contentToInsert, 
        _id: result.insertedId.toString() 
      } 
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    )
  }
}