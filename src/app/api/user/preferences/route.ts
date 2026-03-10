import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { emailNotifications, darkMode } = body

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const users = db.collection('users')

    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          emailNotifications,
          darkMode,
          updatedAt: new Date()
        } 
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes made' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Preferences updated successfully' 
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}