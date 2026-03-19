import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

// For routes without dynamic params, we still need to define the type correctly
type RouteParams = { params: Promise<{}> }

/**
 * GET /api/lectures
 * Fetch all lectures (admin-only)
 */
export async function GET(
  request: NextRequest,
  context: RouteParams
) {
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
    console.error('Error in GET /api/lectures:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/lectures
 * Create a new lecture (admin-only)
 */
export async function POST(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, speaker, category, duration, audioUrl, imageUrl, published } = body

    // Validate required fields
    if (!title || !speaker || !category || !audioUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    
    const lecture = {
      title,
      description: description || '',
      speaker,
      category,
      duration: duration || 0,
      audioUrl,
      imageUrl: imageUrl || null,
      views: 0,
      likes: 0,
      comments: 0,
      downloads: 0,
      published: published || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db
      .collection('lectures')
      .insertOne(lecture)

    return NextResponse.json({
      message: 'Lecture created successfully',
      id: result.insertedId
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/lectures:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}