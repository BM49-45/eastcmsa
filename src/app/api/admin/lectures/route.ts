import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const lectures = await db
      .collection('lectures')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(lectures)
  } catch (error) {
    console.error('Admin Lectures GET Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, speaker, category, duration, audioUrl, imageUrl, published } = body

    if (!title || !speaker || !category || !audioUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const lectures = db.collection('lectures')

    const result = await lectures.insertOne({
      title,
      description,
      speaker,
      category,
      duration: duration || 0,
      audioUrl,
      imageUrl,
      views: 0,
      likes: 0,
      comments: 0,
      downloads: 0,
      published: published || false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      message: 'Lecture created successfully',
      id: result.insertedId
    })
  } catch (error) {
    console.error('Admin Lectures POST Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}