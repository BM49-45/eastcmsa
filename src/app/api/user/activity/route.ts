import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // Optional filter by type

    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const activities = db.collection('activities')

    // Build query
    const query: any = { userId: session.user.id }
    if (type && type !== 'all') {
      if (type === 'downloads') {
        query.type = { $in: ['lecture_download', 'book_download'] }
      } else {
        query.type = type
      }
    }

    // Get total count
    const total = await activities.countDocuments(query)

    // Get activities
    const items = await activities
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      activities: items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + items.length < total
    })
  } catch (error) {
    console.error('Activity Feed Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}