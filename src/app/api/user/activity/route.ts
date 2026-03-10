import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Activity, ActivityFeedResponse, ActivityType } from '@/types/activity'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const typeParam = searchParams.get('type')
    const skip = (page - 1) * limit

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid page parameter' }, 
        { status: 400 }
      )
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' }, 
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const activities = db.collection('activities')

    // Build query with type filtering
    const query: Record<string, any> = { userId: session.user.id }

    if (typeParam) {
      if (typeParam.includes(',')) {
        // Handle multiple types (e.g., "lecture_download,book_download")
        const types = typeParam.split(',').map(t => t.trim()) as ActivityType[]
        query.type = { $in: types }
      } else {
        query.type = typeParam as ActivityType
      }
    }

    // Get activities with pagination
    const [items, total] = await Promise.all([
      activities
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      activities.countDocuments(query)
    ])

    // Transform MongoDB documents to Activity type
    const transformedActivities: Activity[] = items.map(item => ({
      _id: item._id.toString(),
      userId: item.userId,
      type: item.type as ActivityType,
      itemId: item.itemId,
      itemTitle: item.itemTitle,
      metadata: item.metadata,
      createdAt: item.createdAt,
      ip: item.ip,
      userAgent: item.userAgent
    }))

    const response: ActivityFeedResponse = {
      activities: transformedActivities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Activity API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await req.json()
    const { type, itemId, itemTitle, metadata } = body

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Activity type is required' }, 
        { status: 400 }
      )
    }

    // Validate activity type
    const validTypes: ActivityType[] = [
      'lecture_watch',
      'lecture_download',
      'book_read',
      'book_download',
      'comment',
      'like',
      'share',
      'register',
      'login'
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid activity type' }, 
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const activities = db.collection('activities')

    // Get client info for tracking
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    const userAgent = req.headers.get('user-agent') || 'unknown'

    const activity = {
      userId: session.user.id,
      type,
      itemId: itemId || null,
      itemTitle: itemTitle || null,
      metadata: metadata || null,
      createdAt: new Date(),
      ip,
      userAgent
    }

    const result = await activities.insertOne(activity)

    return NextResponse.json({ 
      success: true,
      id: result.insertedId 
    })
  } catch (error) {
    console.error('Create Activity Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// Optional: DELETE endpoint for cleaning up activities (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    // Only allow admins to delete activities
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' }, 
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const olderThan = searchParams.get('olderThan') // e.g., "30d" for 30 days

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const activities = db.collection('activities')

    let query = {}
    
    if (olderThan) {
      const days = parseInt(olderThan.replace('d', ''))
      if (!isNaN(days)) {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - days)
        query = { createdAt: { $lt: cutoffDate } }
      }
    }

    const result = await activities.deleteMany(query)

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    })
  } catch (error) {
    console.error('Delete Activities Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}