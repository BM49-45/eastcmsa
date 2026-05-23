// src/app/api/user/activity/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const client = await clientPromise
    const db = client.db('eastcmsa')

    const activities = await db
      .collection('activities')
      .find({
        userId: session.user.id,
        action: { $in: ['play_audio', 'download', 'favorite', 'share'] },
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    // Format activities for display
    const formattedActivities = activities.map((activity) => ({
      id: activity._id.toString(),
      type:
        activity.action === 'play_audio'
          ? 'view'
          : activity.action === 'favorite'
            ? 'like'
            : activity.action,
      title: activity.contentTitle || 'Unknown',
      speaker: activity.contentSpeaker || 'Unknown',
      category: activity.category || 'general',
      timestamp: activity.timestamp,
    }))

    return NextResponse.json(formattedActivities)
  } catch (error) {
    console.error('User Activity Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
