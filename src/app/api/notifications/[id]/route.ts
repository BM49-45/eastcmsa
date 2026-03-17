import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const { read, archived } = body

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const notifications = db.collection('notifications')

    const updateData: any = {}
    if (read !== undefined) {
      updateData.read = read
      updateData.readAt = read ? new Date() : null
    }
    if (archived !== undefined) {
      updateData.archived = archived
    }

    const result = await notifications.updateOne(
      { 
        _id: new ObjectId(id),
        userId: session.user.id 
      },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification Update Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const notifications = db.collection('notifications')

    const result = await notifications.deleteOne({ 
      _id: new ObjectId(id),
      userId: session.user.id 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification Delete Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}