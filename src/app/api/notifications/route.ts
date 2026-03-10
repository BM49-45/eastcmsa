import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Notification } from '@/types/notification'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const archived = searchParams.get('archived') === 'true'
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const notifications = db.collection('notifications')

    // Build query
    const query: any = { 
      userId: session.user.id,
      archived 
    }
    
    if (type) {
      query.type = type
    }

    // Get notifications with pagination
    const [items, total, unreadCount] = await Promise.all([
      notifications
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      notifications.countDocuments(query),
      notifications.countDocuments({ 
        userId: session.user.id, 
        read: false,
        archived: false 
      })
    ])

    const transformedNotifications: Notification[] = items.map(item => ({
      _id: item._id.toString(),
      userId: item.userId,
      type: item.type,
      title: item.title,
      message: item.message,
      priority: item.priority,
      read: item.read,
      archived: item.archived,
      data: item.data,
      createdAt: item.createdAt,
      readAt: item.readAt,
      expiresAt: item.expiresAt
    }))

    return NextResponse.json({
      notifications: transformedNotifications,
      unreadCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Notifications API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { userId, type, title, message, priority, data } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const notifications = db.collection('notifications')

    const notification = {
      userId,
      type,
      title,
      message,
      priority: priority || 'medium',
      read: false,
      archived: false,
      data: data || {},
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }

    const result = await notifications.insertOne(notification)

    return NextResponse.json({ 
      success: true, 
      notificationId: result.insertedId 
    })
  } catch (error) {
    console.error('Create Notification Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}