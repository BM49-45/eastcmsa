// src/app/api/activities/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

// GET - Retrieve activities
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || session.user.id
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const client = await clientPromise
    const db = client.db('eastcmsa')

    const query: any = {}

    // Admin can see all activities, users see only their own
    if (session.user.role !== 'admin') {
      query.userId = session.user.id
    } else if (userId && userId !== 'all') {
      query.userId = userId
    }

    if (action) query.action = action
    if (startDate) query.timestamp = { $gte: new Date(startDate) }
    if (endDate) query.timestamp = { ...query.timestamp, $lte: new Date(endDate) }

    const activities = await db
      .collection('activities')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Activities GET Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST - Log activity
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action, category, contentId, contentTitle, contentSpeaker } = body

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')

    const activity = {
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      userEmail: session.user.email,
      action,
      category: category || null,
      contentId: contentId || null,
      contentTitle: contentTitle || null,
      contentSpeaker: contentSpeaker || null,
      timestamp: new Date(),
    }

    const result = await db.collection('activities').insertOne(activity)

    // Also update content stats if it's a view or download
    if (contentId && (action === 'view' || action === 'download')) {
      const updateField = action === 'view' ? 'views' : 'downloads'
      await db
        .collection('contents')
        .updateOne({ _id: new ObjectId(contentId) }, { $inc: { [updateField]: 1 } })
    }

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Activities POST Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
