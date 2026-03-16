import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const activities = db.collection('activities')

    const stats = {
      lectures: await activities.countDocuments({ 
        userId: session.user.id, 
        type: 'lecture_watch' 
      }),
      books: await activities.countDocuments({ 
        userId: session.user.id, 
        type: 'book_read' 
      }),
      comments: await activities.countDocuments({ 
        userId: session.user.id, 
        type: 'comment' 
      }),
      likes: await activities.countDocuments({ 
        userId: session.user.id, 
        type: 'like' 
      }),
      downloads: await activities.countDocuments({ 
        userId: session.user.id, 
        type: { $in: ['lecture_download', 'book_download'] } 
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Activity Stats Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}