import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { commentId, content, userId, itemId, itemType, itemTitle } = await req.json()

    if (!commentId || !content || !userId || !itemId || !itemType || !itemTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')
    const comments = db.collection('comments')

    const reply = {
      content,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      userRole: session.user.role,
      itemId,
      itemType,
      itemTitle,
      parentId: commentId,
      status: 'approved',
      likes: 0,
      reports: 0,
      isEdited: false,
      createdAt: new Date(),
      metadata: {
        isAdminReply: true
      }
    }

    const result = await comments.insertOne(reply)

    // Update original comment to mark as replied
    await comments.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { repliedAt: new Date() } }
    )

    return NextResponse.json({ 
      success: true, 
      replyId: result.insertedId 
    })
  } catch (error) {
    console.error('Reply API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}