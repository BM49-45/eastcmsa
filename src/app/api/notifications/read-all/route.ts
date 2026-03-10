import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const notifications = db.collection('notifications')

    const result = await notifications.updateMany(
      { 
        userId: session.user.id,
        read: false 
      },
      { 
        $set: { 
          read: true,
          readAt: new Date()
        } 
      }
    )

    return NextResponse.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    })
  } catch (error) {
    console.error('Mark All Read Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}